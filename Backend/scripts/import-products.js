import "dotenv/config";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { prisma } from "../src/shared/database/client.js";

const sourcePath = process.argv[2];
if (!sourcePath) {
  throw new Error("Usage: node scripts/import-products.js <products.json>");
}

const titleFromId = (id, prefix) =>
  id
    .replace(prefix, "")
    .split("_")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");

const products = JSON.parse(await readFile(resolve(sourcePath), "utf8"));
if (!Array.isArray(products) || products.length === 0) {
  throw new Error("The product file must contain a non-empty JSON array.");
}

const required = ["id", "sku", "name", "costPrice", "sellingPrice"];
for (const [index, product] of products.entries()) {
  for (const field of required) {
    if (product[field] === undefined || product[field] === null || product[field] === "") {
      throw new Error(`Product ${index + 1} is missing ${field}.`);
    }
  }
}

const warehouse =
  (await prisma.inventoryWarehouse.findFirst({ orderBy: { createdAt: "asc" } })) ??
  (await prisma.inventoryWarehouse.create({
    data: { code: "MAIN", name: "Main Warehouse", status: "active" },
  }));

const categoryIds = [...new Set(products.map((product) => product.categoryId).filter(Boolean))];
for (const id of categoryIds) {
  const existing = await prisma.productCategory.findFirst({
    where: { OR: [{ id }, { name: titleFromId(id, "cat_") }] },
  });
  if (!existing) {
    await prisma.productCategory.create({
      data: { id, name: titleFromId(id, "cat_"), status: "active" },
    });
  }
}

const brandIds = [...new Set(products.map((product) => product.brandId).filter(Boolean))];
for (const id of brandIds) {
  const existing = await prisma.productBrand.findFirst({
    where: { OR: [{ id }, { name: titleFromId(id, "brand_") }] },
  });
  if (!existing) {
    await prisma.productBrand.create({
      data: { id, name: titleFromId(id, "brand_"), status: "active" },
    });
  }
}

let created = 0;
let updated = 0;
const importedProducts = [];
for (const input of products) {
  const category = input.categoryId
    ? await prisma.productCategory.findFirst({
        where: { OR: [{ id: input.categoryId }, { name: titleFromId(input.categoryId, "cat_") }] },
      })
    : null;
  const brand = input.brandId
    ? await prisma.productBrand.findFirst({
        where: { OR: [{ id: input.brandId }, { name: titleFromId(input.brandId, "brand_") }] },
      })
    : null;
  const match = await prisma.inventoryProduct.findFirst({
    where: { OR: [{ sku: input.sku }, ...(input.barcode ? [{ barcode: input.barcode }] : [])] },
  });
  const data = {
    sku: input.sku,
    barcode: input.barcode || null,
    name: input.name,
    categoryId: category?.id ?? null,
    brandId: brand?.id ?? null,
    unit: input.unit || "item",
    costPrice: Number(input.costPrice),
    sellingPrice: Number(input.sellingPrice),
    taxRate: Number(input.taxRate || 0),
    discountType: input.discountType || null,
    discountValue: Number(input.discountValue || 0),
    discountStart: input.discountStart ? new Date(input.discountStart) : null,
    discountEnd: input.discountEnd ? new Date(input.discountEnd) : null,
    status: input.status || "active",
  };
  const product = match
    ? await prisma.inventoryProduct.update({ where: { id: match.id }, data })
    : await prisma.inventoryProduct.create({ data: { id: input.id, ...data } });
  importedProducts.push(product);
  match ? updated++ : created++;
  await prisma.inventoryStock.upsert({
    where: { productId_warehouseId: { productId: product.id, warehouseId: warehouse.id } },
    update: { quantity: { set: 100 } },
    create: { productId: product.id, warehouseId: warehouse.id, quantity: 100, reorderLevel: 10 },
  });
}

// Replace the old generated demo catalog while retaining its sales history.
const placeholders = await prisma.inventoryProduct.findMany({
  where: {
    name: { startsWith: "Seed Medical Product" },
    id: { notIn: importedProducts.map((product) => product.id) },
  },
  orderBy: { sku: "asc" },
});
let placeholdersReplaced = 0;
if (placeholders.length === importedProducts.length) {
  for (let index = 0; index < placeholders.length; index++) {
    const sourceId = placeholders[index].id;
    const targetId = importedProducts[index].id;
    await prisma.$transaction([
      prisma.posSaleItem.updateMany({ where: { productId: sourceId }, data: { productId: targetId } }),
      prisma.inventoryMovement.updateMany({ where: { productId: sourceId }, data: { productId: targetId } }),
      prisma.inventoryProductImage.updateMany({ where: { productId: sourceId }, data: { productId: targetId } }),
      prisma.feedback.updateMany({ where: { productId: sourceId }, data: { productId: targetId } }),
      prisma.inventoryStock.deleteMany({ where: { productId: sourceId } }),
    ]);
    await prisma.inventoryProduct.delete({ where: { id: sourceId } });
    placeholdersReplaced++;
  }
}

console.log(JSON.stringify({ source: resolve(sourcePath), total: products.length, created, updated, placeholdersReplaced, warehouse: warehouse.name, stockPerProduct: 100 }, null, 2));
await prisma.$disconnect();
