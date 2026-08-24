import { Router } from "express";
import { z } from "zod";
import multer from "multer";
import path from "node:path";
import { mkdirSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { prisma } from "../../shared/database/client.js";
import { requireAuth } from "../../shared/middleware/auth.middleware.js";
import {
  requireAnyPermission,
  requirePermission,
} from "../../shared/middleware/permission.middleware.js";

const router = Router();
router.use(requireAuth);
const view = requirePermission("inventory.view");
const manage = requirePermission("inventory.manage");
const adjust = requirePermission("inventory.adjust");
const viewForPos = requireAnyPermission("inventory.view", "pos.use");
const imageDirectory = path.resolve(process.cwd(), "public", "product-images");
mkdirSync(imageDirectory, { recursive: true });
const upload = multer({
  storage: multer.diskStorage({
    destination: imageDirectory,
    filename: (_req, file, done) =>
      done(
        null,
        `${randomUUID()}${path.extname(file.originalname).toLowerCase() || ".jpg"}`,
      ),
  }),
  limits: { fileSize: 5 * 1024 * 1024, files: 8 },
  fileFilter: (_req, file, done) =>
    done(
      null,
      ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
        file.mimetype,
      ),
    ),
});
const pageInput = (query) => ({
  page: z.coerce.number().int().min(1).default(1).parse(query.page),
  pageSize: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(50)
    .parse(query.pageSize),
});
const sendPage = async (req, res, model, args) => {
  if (req.query.all === "true")
    return res.json(await prisma[model].findMany(args));
  const { page, pageSize } = pageInput(req.query);
  const [items, total] = await prisma.$transaction([
    prisma[model].findMany({
      ...args,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma[model].count({ where: args.where }),
  ]);
  res.json({
    items,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    },
  });
};
const categorySchema = z.object({
  name: z.string().trim().min(2),
  description: z.string().trim().nullable().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
});
const brandSchema = categorySchema;
const warehouseSchema = z.object({
  code: z.string().trim().min(1),
  name: z.string().trim().min(2),
  location: z.string().trim().nullable().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
});
const optionalId = z.preprocess(
  (value) => (value === "" ? null : value),
  z.string().nullable().optional(),
);
const optionalText = z.preprocess(
  (value) => (value === "" ? null : value),
  z.string().trim().nullable().optional(),
);
const productSchema = z.object({
  sku: z.string().trim().min(1),
  barcode: optionalText,
  name: z.string().trim().min(2),
  categoryId: optionalId,
  brandId: optionalId,
  unit: z.string().trim().min(1).default("item"),
  costPrice: z.coerce.number().min(0),
  sellingPrice: z.coerce.number().min(0),
  taxRate: z.coerce.number().min(0).max(100).default(0),
  discountType: z.preprocess(
    (value) => (value === "" ? null : value),
    z.enum(["percentage", "fixed"]).nullable().optional(),
  ),
  discountValue: z.coerce.number().min(0).default(0),
  discountStart: z.preprocess(
    (value) => (value === "" || value == null ? null : value),
    z.coerce.date().nullable().optional(),
  ),
  discountEnd: z.preprocess(
    (value) => (value === "" || value == null ? null : value),
    z.coerce.date().nullable().optional(),
  ),
  status: z.enum(["active", "inactive"]).default("active"),
  images: z
    .array(
      z.object({
        imageUrl: z.string().startsWith("/public/product-images/"),
        isMain: z.boolean().default(false),
      }),
    )
    .max(8)
    .optional(),
});

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
    if (!(await prisma.inventoryProduct.findUnique({ where: { barcode } })))
      return barcode;
  }
  throw Object.assign(new Error("Unable to generate a unique barcode."), {
    status: 503,
  });
};
const barcodeAssignmentSchema = z.object({
  barcode: z.string().regex(/^\d{13}$/, "A 13-digit barcode is required."),
});

router.post("/products/images", manage, upload.array("images", 8), (req, res) =>
  res.status(201).json(
    (req.files ?? []).map((file) => ({
      imageUrl: `/public/product-images/${file.filename}`,
    })),
  ),
);

router.get("/categories", view, async (req, res, next) => {
  try {
    await sendPage(req, res, "productCategory", { orderBy: { name: "asc" } });
  } catch (e) {
    next(e);
  }
});
router.post("/categories", manage, async (req, res, next) => {
  try {
    res.status(201).json(
      await prisma.productCategory.create({
        data: categorySchema.parse(req.body),
      }),
    );
  } catch (e) {
    next(e);
  }
});
router.patch("/categories/:id", manage, async (req, res, next) => {
  try {
    res.json(
      await prisma.productCategory.update({
        where: { id: req.params.id },
        data: categorySchema.partial().parse(req.body),
      }),
    );
  } catch (e) {
    next(e);
  }
});
router.delete("/categories/:id", manage, async (req, res, next) => {
  try {
    await prisma.productCategory.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});
router.get("/brands", view, async (req, res, next) => {
  try {
    await sendPage(req, res, "productBrand", { orderBy: { name: "asc" } });
  } catch (e) {
    next(e);
  }
});
router.post("/brands", manage, async (req, res, next) => {
  try {
    res
      .status(201)
      .json(
        await prisma.productBrand.create({ data: brandSchema.parse(req.body) }),
      );
  } catch (e) {
    next(e);
  }
});
router.patch("/brands/:id", manage, async (req, res, next) => {
  try {
    res.json(
      await prisma.productBrand.update({
        where: { id: req.params.id },
        data: brandSchema.partial().parse(req.body),
      }),
    );
  } catch (e) {
    next(e);
  }
});
router.delete("/brands/:id", manage, async (req, res, next) => {
  try {
    await prisma.productBrand.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});
router.get("/warehouses", viewForPos, async (req, res, next) => {
  try {
    await sendPage(req, res, "inventoryWarehouse", {
      orderBy: { name: "asc" },
    });
  } catch (e) {
    next(e);
  }
});
router.post("/warehouses", manage, async (req, res, next) => {
  try {
    res.status(201).json(
      await prisma.inventoryWarehouse.create({
        data: warehouseSchema.parse(req.body),
      }),
    );
  } catch (e) {
    next(e);
  }
});
router.patch("/warehouses/:id", manage, async (req, res, next) => {
  try {
    res.json(
      await prisma.inventoryWarehouse.update({
        where: { id: req.params.id },
        data: warehouseSchema.partial().parse(req.body),
      }),
    );
  } catch (e) {
    next(e);
  }
});
router.delete("/warehouses/:id", manage, async (req, res, next) => {
  try {
    await prisma.inventoryWarehouse.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});
router.get("/products", viewForPos, async (req, res, next) => {
  try {
    const where = {
      ...(req.query.search && {
        OR: [
          { name: { contains: String(req.query.search) } },
          { sku: { contains: String(req.query.search) } },
          { barcode: { contains: String(req.query.search) } },
        ],
      }),
      ...(req.query.categoryId && { categoryId: String(req.query.categoryId) }),
      ...(req.query.status && { status: String(req.query.status) }),
      ...(req.query.sku && { sku: { contains: String(req.query.sku) } }),
      ...(req.query.barcode && {
        barcode: { contains: String(req.query.barcode) },
      }),
      ...((req.query.minPrice || req.query.maxPrice) && {
        sellingPrice: {
          ...(req.query.minPrice && { gte: Number(req.query.minPrice) }),
          ...(req.query.maxPrice && { lte: Number(req.query.maxPrice) }),
        },
      }),
      ...(req.query.discountType && {
        discountType: String(req.query.discountType),
      }),
      ...(req.query.inStock === "true" && {
        stocks: { some: { quantity: { gt: 0 } } },
      }),
    };
    await sendPage(req, res, "inventoryProduct", {
      where,
      include: {
        category: true,
        brand: true,
        stocks: { include: { warehouse: true } },
        images: { orderBy: { sortOrder: "asc" } },
      },
      orderBy: { name: "asc" },
    });
  } catch (e) {
    next(e);
  }
});
router.get("/products/barcode/new", manage, async (_req, res, next) => {
  try {
    res.json({ barcode: await generateProductBarcode() });
  } catch (e) {
    next(e);
  }
});
router.post("/products", manage, async (req, res, next) => {
  try {
    const input = productSchema.parse(req.body);
    if (input.discountType === "percentage" && input.discountValue > 100)
      return res
        .status(400)
        .json({ message: "Percentage discount cannot exceed 100%." });
    if (
      input.discountStart &&
      input.discountEnd &&
      input.discountEnd < input.discountStart
    )
      return res
        .status(400)
        .json({ message: "Discount expiry must be after its start date." });
    const images = input.images;
    delete input.images;
    res.status(201).json(
      await prisma.inventoryProduct.create({
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
      }),
    );
  } catch (e) {
    next(e);
  }
});
router.patch("/products/:id", manage, async (req, res, next) => {
  try {
    const input = productSchema.partial().parse(req.body);
    if (input.discountType === "percentage" && input.discountValue > 100)
      return res
        .status(400)
        .json({ message: "Percentage discount cannot exceed 100%." });
    if (
      input.discountStart &&
      input.discountEnd &&
      input.discountEnd < input.discountStart
    )
      return res
        .status(400)
        .json({ message: "Discount expiry must be after its start date." });
    const images = input.images;
    delete input.images;
    if (images)
      await prisma.inventoryProductImage.deleteMany({
        where: { productId: req.params.id },
      });
    res.json(
      await prisma.inventoryProduct.update({
        where: { id: req.params.id },
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
      }),
    );
  } catch (e) {
    next(e);
  }
});
router.patch("/products/:id/barcode", manage, async (req, res, next) => {
  try {
    const { barcode } = barcodeAssignmentSchema.parse(req.body);
    const product = await prisma.inventoryProduct.findUniqueOrThrow({
      where: { id: req.params.id },
      select: { id: true, barcode: true },
    });
    if (product.barcode)
      throw Object.assign(new Error("This product already has a barcode."), {
        status: 409,
      });
    for (let attempt = 0; attempt < 10; attempt++) {
      try {
        return res.json(
          await prisma.inventoryProduct.update({
            where: { id: req.params.id },
            data: { barcode },
            include: {
              category: true,
              brand: true,
              images: true,
              stocks: true,
            },
          }),
        );
      } catch (error) {
        if (error.code !== "P2002") throw error;
      }
    }
    throw Object.assign(new Error("Unable to reserve a unique barcode."), {
      status: 503,
    });
  } catch (e) {
    next(e);
  }
});
router.delete("/products/:id/barcode", manage, async (req, res, next) => {
  try {
    const product = await prisma.inventoryProduct.findUniqueOrThrow({
      where: { id: req.params.id },
      select: { id: true },
    });
    await prisma.inventoryProduct.update({
      where: { id: product.id },
      data: { barcode: null },
    });
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});
router.delete("/products/:id", manage, async (req, res, next) => {
  try {
    const product = await prisma.inventoryProduct.findUniqueOrThrow({
      where: { id: req.params.id },
      select: {
        id: true,
        _count: { select: { saleItems: true, movements: true } },
      },
    });
    const hasHistory =
      product._count.saleItems > 0 || product._count.movements > 0;
    if (hasHistory) {
      await prisma.inventoryProduct.update({
        where: { id: product.id },
        data: { status: "inactive" },
      });
      return res.json({
        archived: true,
        message: "Product archived because it has transaction history.",
      });
    }
    await prisma.inventoryProduct.delete({ where: { id: product.id } });
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});
router.get("/stock", view, async (req, res, next) => {
  try {
    const where = {
      ...(req.query.warehouseId && {
        warehouseId: String(req.query.warehouseId),
      }),
      ...(req.query.productId && { productId: String(req.query.productId) }),
    };
    await sendPage(req, res, "inventoryStock", {
      where,
      include: { product: { include: { category: true } }, warehouse: true },
      orderBy: { product: { name: "asc" } },
    });
  } catch (e) {
    next(e);
  }
});
router.get("/movements", view, async (req, res, next) => {
  try {
    await sendPage(req, res, "inventoryMovement", {
      include: { product: true, warehouse: true },
      orderBy: { occurredAt: "desc" },
    });
  } catch (e) {
    next(e);
  }
});
router.post("/adjust", adjust, async (req, res, next) => {
  try {
    const input = z
      .object({
        productId: z.string(),
        warehouseId: z.string(),
        movementType: z.enum([
          "purchase",
          "adjustment_in",
          "adjustment_out",
          "transfer_in",
          "transfer_out",
          "return",
        ]),
        quantity: z.coerce.number().positive(),
        reorderLevel: z.coerce.number().min(0).optional(),
        reference: z.string().trim().nullable().optional(),
        notes: z.string().trim().nullable().optional(),
      })
      .parse(req.body);
    const incoming = [
      "purchase",
      "adjustment_in",
      "transfer_in",
      "return",
    ].includes(input.movementType);
    const signed = incoming ? input.quantity : -input.quantity;
    const result = await prisma.$transaction(async (tx) => {
      const current = await tx.inventoryStock.findUnique({
        where: {
          productId_warehouseId: {
            productId: input.productId,
            warehouseId: input.warehouseId,
          },
        },
      });
      if ((current?.quantity ?? 0) + signed < 0) {
        const error = new Error("Insufficient stock for this movement.");
        error.status = 409;
        throw error;
      }
      const stock = await tx.inventoryStock.upsert({
        where: {
          productId_warehouseId: {
            productId: input.productId,
            warehouseId: input.warehouseId,
          },
        },
        update: {
          quantity: { increment: signed },
          ...(input.reorderLevel !== undefined && {
            reorderLevel: input.reorderLevel,
          }),
        },
        create: {
          productId: input.productId,
          warehouseId: input.warehouseId,
          quantity: signed,
          reorderLevel: input.reorderLevel ?? 0,
        },
        include: { product: true, warehouse: true },
      });
      await tx.inventoryMovement.create({
        data: {
          productId: input.productId,
          warehouseId: input.warehouseId,
          movementType: input.movementType,
          quantity: signed,
          reference: input.reference,
          notes: input.notes,
        },
      });
      return stock;
    });
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
});

export default router;
