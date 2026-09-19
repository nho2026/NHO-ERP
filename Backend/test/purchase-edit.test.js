import assert from "node:assert/strict";
import { test } from "node:test";
import { savePurchase } from "../src/modules/inventory/purchases/purchases.service.js";

function fixture({ stock = 10, paidAmount = 0, status = "completed", productStatus = "active", warehouseStatus = "active" } = {}) {
  const existing = { id: "purchase", status, paidAmount,
    items: [{ productId: "product", warehouseId: "warehouse", quantity: 5 }] };
  const changes = [], movements = [];
  const tx = {
    $queryRaw: async () => [],
    inventoryPurchase: {
      findUnique: async () => existing,
      update: async ({ data }) => ({ ...existing, ...data }),
    },
    inventoryProduct: { findMany: async () => [{ id: "product", name: "Product", unit: "item", status: productStatus }] },
    inventoryWarehouse: { findMany: async () => [{ id: "warehouse", name: "Warehouse", status: warehouseStatus }] },
    inventoryStock: {
      findUnique: async () => ({ quantity: stock }),
      updateMany: async (args) => { changes.push(args); return { count: stock >= args.where.quantity.gte ? 1 : 0 }; },
      upsert: async (args) => { changes.push(args); },
    },
    inventoryMovement: { create: async ({ data }) => { movements.push(data); } },
  };
  const input = { invoiceNumber: "INV-1", retailer: "Retailer", buyDate: "2026-09-16", isDebt: true,
    items: [{ productId: "product", warehouseId: "warehouse", quantity: 3, price: 10, unit: "item" }] };
  return { db: { $transaction: (run) => run(tx) }, tx, input, changes, movements };
}

test("editing decrements only the quantity difference and recalculates totals", async () => {
  const f = fixture();
  const result = await savePurchase(f.db, f.input, "purchase");
  assert.equal(result.totalPrice, 30);
  assert.equal(f.changes[0].data.quantity.increment, -2);
  assert.equal(f.movements[0].quantity, -2);
  assert.equal(f.movements[0].movementType, "adjustment_out");
});

test("increasing a purchase adds only the extra stock", async () => {
  const f = fixture(); f.input.items[0].quantity = 7;
  await savePurchase(f.db, f.input, "purchase");
  assert.equal(f.changes[0].update.quantity.increment, 2);
  assert.equal(f.movements[0].movementType, "adjustment_in");
});

test("price and invoice edits do not move stock", async () => {
  const f = fixture(); f.input.items[0].quantity = 5;
  await savePurchase(f.db, f.input, "purchase");
  assert.equal(f.changes.length, 0);
  assert.equal(f.movements.length, 0);
});

test("stock reductions fail when goods are no longer available", async () => {
  const f = fixture({ stock: 1 });
  await assert.rejects(savePurchase(f.db, f.input, "purchase"), /Insufficient stock/);
});

test("edits cannot undercut recorded payments or clear paid debt", async () => {
  const f = fixture({ paidAmount: 40 });
  await assert.rejects(savePurchase(f.db, f.input, "purchase"), /recorded payments/);
  f.input.items[0].quantity = 5; f.input.isDebt = false;
  await assert.rejects(savePurchase(f.db, f.input, "purchase"), /recorded payments/);
  assert.equal(f.changes.length, 0);
});

test("returned purchases cannot be edited", async () => {
  const f = fixture({ status: "returned" });
  await assert.rejects(savePurchase(f.db, f.input, "purchase"), /Only completed/);
});


test("invoice and attachment edits succeed with zero stock when quantities stay unchanged", async () => {
  const f = fixture({ stock: 0 });
  f.input.items[0].quantity = 5;
  f.input.attachmentUrl = "/public/product-images/invoice.png";
  const result = await savePurchase(f.db, f.input, "purchase");
  assert.equal(result.attachmentUrl, f.input.attachmentUrl);
  assert.equal(f.changes.length, 0);
  assert.equal(f.movements.length, 0);
});

test("stock conflicts explain the required reduction and available quantity", async () => {
  const f = fixture({ stock: 0 });
  await assert.rejects(savePurchase(f.db, f.input, "purchase"), (error) =>
    error.status === 409 && /removing 2 units, but only 0 are available/.test(error.message));
});


test("existing inactive products and storage allow attachment-only edits", async () => {
  const f = fixture({ stock: 0, productStatus: "inactive", warehouseStatus: "inactive" });
  f.input.items[0].quantity = 5;
  f.input.attachmentUrl = "/public/product-images/invoice.png";
  assert.equal((await savePurchase(f.db, f.input, "purchase")).attachmentUrl, f.input.attachmentUrl);
  assert.equal(f.changes.length, 0);
});

test("inactive invoice items cannot increase, including duplicate lines", async () => {
  const f = fixture({ productStatus: "inactive" });
  f.input.items[0].quantity = 6;
  await assert.rejects(savePurchase(f.db, f.input, "purchase"), /is inactive/);
  f.input.items[0].quantity = 3;
  f.input.items.push({ ...f.input.items[0] });
  await assert.rejects(savePurchase(f.db, f.input, "purchase"), /is inactive/);
  assert.equal(f.changes.length, 0);
});

test("new purchases still require active products and storage", async () => {
  for (const statuses of [{ productStatus: "inactive" }, { warehouseStatus: "inactive" }]) {
    const f = fixture(statuses);
    f.tx.inventoryPurchase.findUnique = async () => null;
    await assert.rejects(savePurchase(f.db, f.input), /is inactive/);
  }
});

test("invoice-only edits preserve snapshots for removed products and storage", async () => {
  const f = fixture({ stock: 0 });
  f.tx.inventoryProduct.findMany = async () => [];
  f.tx.inventoryWarehouse.findMany = async () => [];
  const original = await f.tx.inventoryPurchase.findUnique();
  Object.assign(original.items[0], { productName: "Historical product", warehouseName: "Historical storage", unit: "item" });
  f.input.items[0].quantity = 5;
  f.input.attachmentUrl = "/public/product-images/invoice.png";
  const result = await savePurchase(f.db, f.input, "purchase");
  assert.equal(result.items[0].productName, "Historical product");
  assert.equal(result.items[0].warehouseName, "Historical storage");
  assert.equal(result.attachmentUrl, f.input.attachmentUrl);
  assert.equal(f.changes.length, 0);
  assert.equal(f.movements.length, 0);
});

test("historical references cannot change quantity or be silently removed", async () => {
  const f = fixture();
  f.tx.inventoryProduct.findMany = async () => [];
  await assert.rejects(savePurchase(f.db, f.input, "purchase"), /Historical item/);
  assert.equal(f.changes.length, 0);
  f.input.items = [];
  f.tx.inventoryProduct.findUnique = async () => null;
  f.tx.inventoryWarehouse.findUnique = async () => ({ id: "warehouse" });
  await assert.rejects(savePurchase(f.db, f.input, "purchase"), /Cannot remove a historical item/);
});

test("new purchases cannot use deleted catalog records", async () => {
  const f = fixture();
  f.tx.inventoryPurchase.findUnique = async () => null;
  f.tx.inventoryProduct.findMany = async () => [];
  await assert.rejects(savePurchase(f.db, f.input), /no longer exists/);
});
