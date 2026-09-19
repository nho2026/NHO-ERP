import assert from "node:assert/strict";
import { test } from "node:test";
import { purchasesModel } from "../src/modules/inventory/purchases/purchases.model.js";
import { purchasesService } from "../src/modules/inventory/purchases/purchases.service.js";

test("invoice availability filters are applied to purchase history", async (t) => {
  const calls = [];
  t.mock.method(purchasesModel, "paginate", async (_query, _model, args) => { calls.push(args.where); return { items: [] }; });
  for (const hasInvoice of ["true", "false", ""]) {
    await purchasesService.list({ query: { hasInvoice } });
  }
  assert.equal(calls[0].hasInvoice, true);
  assert.equal(calls[1].hasInvoice, false);
  assert.ok(!("hasInvoice" in calls[2]));
  await assert.rejects(purchasesService.list({ query: { hasInvoice: "invalid" } }), { status: 400 });
});
