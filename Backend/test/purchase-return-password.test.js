import assert from "node:assert/strict";
import { test } from "node:test";
import { hashSecret } from "../src/shared/security/password.js";
import { purchasesModel } from "../src/modules/inventory/purchases/purchases.model.js";
import { purchasesService } from "../src/modules/inventory/purchases/purchases.service.js";

test("purchase return verifies password before entering the stock transaction", async (t) => {
  const passwordHash = await hashSecret("correct-password");
  let transactions = 0;
  t.mock.method(purchasesModel, "$transaction", async (run) => {
    transactions++;
    return run({ $queryRaw: async () => [], inventoryPurchase: {
      findUnique: async () => ({ id: "p1", status: "returned" }),
    } });
  });
  for (const body of [{}, { password: "" }, undefined]) {
    await assert.rejects(purchasesService.returnPurchase({ id: "p1", body, passwordHash }), { name: "ZodError" });
  }
  await assert.rejects(purchasesService.returnPurchase({ id: "p1", body: { password: "wrong" }, passwordHash }), { status: 403 });
  await assert.rejects(purchasesService.returnPurchase({ id: "p1", body: { password: "correct-password" } }), { status: 403 });
  assert.equal(transactions, 0);
  assert.equal((await purchasesService.returnPurchase({ id: "p1", body: { password: "correct-password" }, passwordHash })).status, "returned");
  assert.equal(transactions, 1);
});
