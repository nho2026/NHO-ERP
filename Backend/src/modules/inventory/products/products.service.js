import { expiryDateSchema } from "./products.schema.js";
import { specialPriceSchema } from "./products.schema.js";
import { specialProductSchema } from "./products.schema.js";
import { productsModel } from "./products.model.js";
import { productSchema, barcodeAssignmentSchema } from "./products.schema.js";
const ean13CheckDigit = (digits) => {
  const sum = digits
    .split("")
    .reduce(
      (total, digit, index) => total + Number(digit) * (index % 2 ? 3 : 1),
      0,
    );
  return String((10 - (sum % 10)) % 10);
};
const generateProductBarcode = async () => {
  for (let attempt = 0; attempt < 20; attempt++) {
    const body = `29${`${Date.now()}${Math.floor(Math.random() * 1000)}`.slice(-10)}`;
    const barcode = `${body}${ean13CheckDigit(body)}`;
    if (!(await productsModel.findUnique({ where: { barcode } })))
      return barcode;
  }
  throw Object.assign(new Error("Unable to generate a unique barcode."), {
    status: 503,
  });
};
export const productsService = {
  updateExpiryDate: async ({ id, body }) => {
    const { expiryDate } = expiryDateSchema.parse(body);
    const product = await productsModel.findUnique({ where: { id } });
    if (!product || product.status !== "active") throw Object.assign(new Error("Active product not found."), { status: 404 });
    return productsModel.update({ where: { id }, data: { expiryDate: expiryDate ? new Date(`${expiryDate}T00:00:00.000Z`) : null } });
  },
  updateSpecialPrice: async ({ id, body }) => {
    const data = specialPriceSchema.parse(body);
    const product = await productsModel.findUnique({ where: { id } });
    if (!product || product.status !== "active") throw Object.assign(new Error("Active product not found."), { status: 404 });
    return productsModel.update({ where: { id }, data });
  },
  updateSpecial: ({ id, body }) =>
    productsModel.updateSpecial(id, specialProductSchema.parse(body)),
  createSpecial: ({ body }) =>
    productsModel.createSpecial(specialProductSchema.parse(body)),
  uploadImages: async ({ files }) => {
    return (files ?? []).map((file) => ({
      imageUrl: `/public/product-images/${file.filename}`,
    }));
  },
  list: async ({ query = {} }) => {
    const where = {
      ...(query.isSpecial === "true" && { isSpecial: true }),
      ...(query.search && {
        OR: [
          { name: { contains: String(query.search) } },
          { sku: { contains: String(query.search) } },
          { barcode: { contains: String(query.search) } },
        ],
      }),
      ...(query.categoryId && { categoryId: String(query.categoryId) }),
      ...(query.status && { status: String(query.status) }),
      ...(query.sku && { sku: { contains: String(query.sku) } }),
      ...(query.barcode && {
        barcode: { contains: String(query.barcode) },
      }),
      ...((query.minPrice || query.maxPrice) && {
        sellingPrice: {
          ...(query.minPrice && { gte: Number(query.minPrice) }),
          ...(query.maxPrice && { lte: Number(query.maxPrice) }),
        },
      }),
      ...(query.discountType && {
        discountType: String(query.discountType),
      }),
      ...(query.inStock === "true" && {
        stocks: { some: { quantity: { gt: 0 } } },
      }),
    };
    return await productsModel.paginate(query, "inventoryProduct", {
      where,
      include: {
        category: true,
        brand: true,
        stocks: { include: { warehouse: true } },
        images: { orderBy: { sortOrder: "asc" } },
      },
      orderBy: { name: "asc" },
    });
  },
  newBarcode: async () => {
    return { barcode: await generateProductBarcode() };
  },
  create: async ({ body }) => {
    const input = productSchema.parse(body);
    if (input.discountType === "percentage" && input.discountValue > 100)
      throw Object.assign(
        new Error("Percentage discount cannot exceed 100%."),
        { status: 400 },
      );
    if (
      input.discountStart &&
      input.discountEnd &&
      input.discountEnd < input.discountStart
    )
      throw Object.assign(
        new Error("Discount expiry must be after its start date."),
        { status: 400 },
      );
    const images = input.images;
    delete input.images;
    return await productsModel.create({
      data: {
        ...input,
        ...(images?.length && {
          images: {
            create: images.map((image, sortOrder) => ({
              ...image,
              isMain:
                sortOrder ===
                Math.max(
                  0,
                  images.findIndex((item) => item.isMain),
                ),
              sortOrder,
            })),
          },
        }),
      },
      include: {
        category: true,
        brand: true,
        images: { orderBy: { sortOrder: "asc" } },
      },
    });
  },
  update: async ({ body, id }) => {
    const input = productSchema.partial().parse(body);
    if (input.discountType === "percentage" && input.discountValue > 100)
      throw Object.assign(
        new Error("Percentage discount cannot exceed 100%."),
        { status: 400 },
      );
    if (
      input.discountStart &&
      input.discountEnd &&
      input.discountEnd < input.discountStart
    )
      throw Object.assign(
        new Error("Discount expiry must be after its start date."),
        { status: 400 },
      );
    const images = input.images;
    delete input.images;
    if (images)
      await productsModel.deleteImages({
        where: { productId: id },
      });
    return await productsModel.update({
      where: { id: id },
      data: {
        ...input,
        ...(images && {
          images: {
            create: images.map((image, sortOrder) => ({
              ...image,
              isMain:
                sortOrder ===
                Math.max(
                  0,
                  images.findIndex((item) => item.isMain),
                ),
              sortOrder,
            })),
          },
        }),
      },
      include: {
        category: true,
        brand: true,
        images: { orderBy: { sortOrder: "asc" } },
      },
    });
  },
  assignBarcode: async ({ body, id }) => {
    const { barcode } = barcodeAssignmentSchema.parse(body);
    const product = await productsModel.findUniqueOrThrow({
      where: { id: id },
      select: { id: true, barcode: true },
    });
    if (product.barcode)
      throw Object.assign(new Error("This product already has a barcode."), {
        status: 409,
      });
    for (let attempt = 0; attempt < 10; attempt++) {
      try {
        return await productsModel.update({
          where: { id: id },
          data: { barcode },
          include: {
            category: true,
            brand: true,
            images: true,
            stocks: true,
          },
        });
      } catch (error) {
        if (error.code !== "P2002") throw error;
      }
    }
    throw Object.assign(new Error("Unable to reserve a unique barcode."), {
      status: 503,
    });
  },
  removeBarcode: async ({ id }) => {
    const product = await productsModel.findUniqueOrThrow({
      where: { id: id },
      select: { id: true },
    });
    await productsModel.update({
      where: { id: product.id },
      data: { barcode: null },
    });
    return undefined;
  },
  remove: async ({ id }) => {
    const product = await productsModel.findUniqueOrThrow({
      where: { id: id },
      select: {
        id: true,
        _count: { select: { saleItems: true, movements: true } },
      },
    });
    const hasHistory =
      product._count.saleItems > 0 || product._count.movements > 0;
    if (hasHistory) {
      await productsModel.update({
        where: { id: product.id },
        data: { status: "inactive" },
      });
      return {
        archived: true,
        message: "Product archived because it has transaction history.",
      };
    }
    await productsModel.delete({ where: { id: product.id } });
    return undefined;
  },
};
