import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, access } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { savePurchase } from "../src/modules/inventory/purchases/purchases.service.js";
import { productsModel } from "../src/modules/inventory/products/products.model.js";
import { productsService } from "../src/modules/inventory/products/products.service.js";

const oldUrl = "/public/product-images/00000000-0000-4000-8000-000000000001.png";
const newUrl = "/public/product-images/00000000-0000-4000-8000-000000000002.png";
function fixture(attachmentUrl, fail = false) {
  let committed = false;
  const item = { productId: "p1", warehouseId: "w1", quantity: 1, price: 10, unit: "item" };
  const tx = {
    $queryRaw: async () => [],
    inventoryPurchase: {
      findUnique: async () => ({ id: "purchase", status: "completed", paidAmount: 0, attachmentUrl: oldUrl, items: [item] }),
      update: async ({ data }) => ({ id: "purchase", ...data }),
    },
    inventoryProduct: { findMany: async () => [{ id: "p1", name: "Product", unit: "item", status: "active" }] },
    inventoryWarehouse: { findMany: async () => [{ id: "w1", name: "Warehouse", status: "active" }] },
  };
  return {
    db: { $transaction: async (run) => { const result = await run(tx); if (fail) throw new Error("Transaction failed"); committed = true; return result; } },
    input: { invoiceNumber: "INV-1", retailer: "Retailer", buyDate: "2026-09-18", hasInvoice: Boolean(attachmentUrl), attachmentUrl, items: [item] },
    committed: () => committed,
  };
}

test("removing and replacing an invoice image deletes its file after commit", async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), "purchase-image-cleanup-"));
  const directory = path.join(root, "public", "product-images");
  await mkdir(directory, { recursive: true });
  t.mock.method(process, "cwd", () => root);
  for (const attachmentUrl of [null, newUrl]) {
    const f = fixture(attachmentUrl);
    const oldFile = path.join(root, oldUrl.slice(1));
    await writeFile(oldFile, "old image");
    t.mock.method(productsModel, "imageReferences", async () => { assert.equal(f.committed(), true); return false; });
    const result = await savePurchase(f.db, f.input, "purchase");
    assert.equal(result.attachmentUrl, attachmentUrl);
    await assert.rejects(access(oldFile), { code: "ENOENT" });
  }
});

test("unchanged images and failed updates do not trigger file cleanup", async (t) => {
  let calls = 0;
  t.mock.method(productsService, "removeImage", async () => { calls++; });
  const unchanged = fixture(oldUrl);
  await savePurchase(unchanged.db, unchanged.input, "purchase");
  const failed = fixture(null, true);
  await assert.rejects(savePurchase(failed.db, failed.input, "purchase"), /Transaction failed/);
  assert.equal(calls, 0);
});

test("images referenced elsewhere are retained", async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), "purchase-image-retained-"));
  await mkdir(path.join(root, "public", "product-images"), { recursive: true });
  const oldFile = path.join(root, oldUrl.slice(1));
  await writeFile(oldFile, "shared image");
  t.mock.method(process, "cwd", () => root);
  t.mock.method(productsModel, "imageReferences", async () => true);
  const f = fixture(null);
  await savePurchase(f.db, f.input, "purchase");
  await access(oldFile);
});
