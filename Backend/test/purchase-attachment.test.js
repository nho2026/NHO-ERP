import assert from "node:assert/strict";
import { test } from "node:test";
import { purchaseSchema, purchaseEditSchema } from "../src/modules/inventory/purchases/purchases.schema.js";
import { reversePurchase } from "../src/modules/inventory/purchases/purchases.service.js";

const input = {
  requestId: "00000000-0000-4000-8000-000000000001", invoiceNumber: "INV-1",
  buyDate: "2026-09-18", retailer: "Retailer",
  items: [{ productId: "p1", warehouseId: "w1", quantity: 1, price: 10 }],
};

test("create and edit require a valid invoice attachment", () => {
  for (const schema of [purchaseSchema, purchaseEditSchema]) {
    for (const attachmentUrl of [undefined, null, "", "https://example.com/invoice.png"]) {
      assert.equal(schema.safeParse({ ...input, hasInvoice: true, attachmentUrl }).success, false);
    }
    assert.equal(schema.safeParse({ ...input, hasInvoice: true, attachmentUrl: "/public/product-images/invoice.png" }).success, true);
  }
});

test("missing attachments prevent return and deletion before any mutations", async () => {
  for (const status of ["returned", "deleted"]) {
    let mutated = false;
    const db = { $transaction: (run) => run({
      $queryRaw: async () => [],
      inventoryPurchase: {
        findUnique: async () => ({ id: "purchase", status: "completed", attachmentUrl: null, paidAmount: 0 }),
        updateMany: async () => { mutated = true; return { count: 1 }; },
      },
    }) };
    await assert.rejects(reversePurchase(db, "purchase", status), (error) => error.status === 409 && /Attach an invoice/.test(error.message));
    assert.equal(mutated, false);
  }
});


test("invoice unavailable permits saving without an attachment", () => {
  for (const schema of [purchaseSchema, purchaseEditSchema]) {
    assert.equal(schema.safeParse({ ...input, hasInvoice: false, attachmentUrl: null }).success, true);
  }
});

test("return permits no attachment when invoice is explicitly unavailable", async () => {
  const movements = [];
  const db = { $transaction: (run) => run({
    $queryRaw: async () => [],
    inventoryPurchase: {
      findUnique: async () => ({ id: "purchase", status: "completed", hasInvoice: false, attachmentUrl: null, paidAmount: 0,
        invoiceNumber: "INV-1", items: [{ productId: "p1", warehouseId: "w1", quantity: 1 }] }),
      updateMany: async () => ({ count: 1 }),
    },
    inventoryStock: { updateMany: async () => ({ count: 1 }) },
    inventoryMovement: { create: async ({ data }) => { movements.push(data); } },
  }) };
  const result = await reversePurchase(db, "purchase", "returned");
  assert.equal(result.status, "returned");
  assert.equal(movements[0].quantity, -1);
});

test("return still rejects a missing attachment when invoice is available", async () => {
  const db = { $transaction: (run) => run({
    $queryRaw: async () => [],
    inventoryPurchase: { findUnique: async () => ({ id: "purchase", status: "completed", hasInvoice: true, attachmentUrl: null }) },
  }) };
  await assert.rejects(reversePurchase(db, "purchase", "returned"), { status: 409 });
});
