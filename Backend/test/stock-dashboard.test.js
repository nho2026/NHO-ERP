import assert from "node:assert/strict";
import { test } from "node:test";
import { stockModel } from "../src/modules/inventory/stock/stock.model.js";
import { stockService } from "../src/modules/inventory/stock/stock.service.js";

test("dashboard summaries serialize database counts without fetching stock records", async (t) => {
  const original = stockModel.summary;
  t.after(() => { stockModel.summary = original; });
  stockModel.summary = async () => [{ warehouseId: "w1", total: 5n, units: 12.5, emptyCount: 1n, low: 2n }];
  const result = await stockService.summary();
  assert.deepEqual(result, [{ warehouseId: "w1", total: 5, units: 12.5, empty: 1, low: 2 }]);
  assert.doesNotThrow(() => JSON.stringify(result));
});

test("paginated alerts apply low stock and warehouse filters together", async (t) => {
  const original = stockModel.paginate;
  t.after(() => { stockModel.paginate = original; });
  stockModel.paginate = async (query, model, args) => {
    assert.equal(model, "inventoryStock");
    assert.equal(query.page, "2");
    assert.equal(args.where.warehouseId, "w1");
    assert.deepEqual(args.where.OR, stockModel.lowStockWhere().OR);
    return { items: [] };
  };
  await stockService.list({ query: { onlyLow: "true", warehouseId: "w1", page: "2" } });
});
