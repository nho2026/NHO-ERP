import assert from "node:assert/strict";
import { test } from "node:test";
import { purchaseFiltersWhere } from "../src/modules/inventory/purchases/purchase-filters.js";
import { purchasesModel } from "../src/modules/inventory/purchases/purchases.model.js";
import { purchasesService } from "../src/modules/inventory/purchases/purchases.service.js";

test("purchase ranges include the entire end date and support zero totals", () => {
  const where = purchaseFiltersWhere({ fromDate: "2026-09-01", toDate: "2026-09-18", minTotal: "0", maxTotal: "200.50", isDebt: "false", purchaseStatus: "returned", invoiceNumber: " INV ", salesperson: " Sales " });
  assert.deepEqual(where, {
    invoiceNumber: { contains: "INV" }, salesperson: { contains: "Sales" }, isDebt: false, status: "returned",
    buyDate: { gte: new Date("2026-09-01T00:00:00Z"), lt: new Date("2026-09-19T00:00:00Z") },
    totalPrice: { gte: 0, lte: 200.5 },
  });
  assert.deepEqual(purchaseFiltersWhere({ fromDate: "", minTotal: "", salesperson: "" }), {});
});

test("invalid purchase filters reject reversed ranges and invalid values", () => {
  for (const query of [
    { fromDate: "2026-09-18", toDate: "2026-09-01" }, { fromDate: "invalid" },
    { minTotal: "20", maxTotal: "10" }, { minTotal: "-1" }, { maxTotal: "Infinity" },
    { isDebt: "invalid" }, { purchaseStatus: "deleted" },
  ]) assert.throws(() => purchaseFiltersWhere(query), { name: "ZodError" });
});

test("purchase history combines new inputs with existing filters", async (t) => {
  t.mock.method(purchasesModel, "paginate", async (_query, _model, args) => {
    assert.equal(args.where.hasInvoice, false);
    assert.equal(args.where.retailer, "Retailer");
    assert.equal(args.where.status, "returned");
    assert.deepEqual(args.where.totalPrice, { gte: 10 });
    assert.deepEqual(args.where.invoiceNumber, { contains: "INV" });
    assert.equal(args.where.OR.length, 3);
    return { items: [] };
  });
  await purchasesService.list({ query: { hasInvoice: "false", retailer: "Retailer", search: "note", purchaseStatus: "returned", minTotal: "10", invoiceNumber: "INV" } });
});

test("debt records, pagination count and summary use the same filters", async (t) => {
  const calls = [];
  t.mock.method(purchasesModel, "findMany", (args) => { calls.push(args.where); return []; });
  t.mock.method(purchasesModel, "count", (args) => { calls.push(args.where); return 0; });
  t.mock.method(purchasesModel, "aggregate", (args) => { calls.push(args.where); return { _sum: { totalPrice: 0, paidAmount: 0 } }; });
  t.mock.method(purchasesModel, "$transaction", (queries) => Promise.all(queries));
  await purchasesService.debts({ query: { invoiceNumber: "INV", maxTotal: "100", fromDate: "2026-09-01", hasInvoice: "true" } });
  assert.equal(calls.length, 3);
  for (const where of calls) {
    assert.equal(where.isDebt, true);
    assert.equal(where.status, "completed");
    assert.equal(where.hasInvoice, true);
    assert.deepEqual(where.invoiceNumber, { contains: "INV" });
    assert.deepEqual(where.totalPrice, { lte: 100 });
    assert.deepEqual(where.buyDate, { gte: new Date("2026-09-01T00:00:00Z") });
  }
});
