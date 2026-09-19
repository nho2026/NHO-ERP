import assert from "node:assert/strict";
import { test } from "node:test";
import { prisma } from "../src/shared/database/client.js";
import { purchasesService } from "../src/modules/inventory/purchases/purchases.service.js";

test("retailer search is parameterized and the second page uses a bounded query", async (t) => {
  const search = "O'Reilly_%";
  const calls = [];
  const original = prisma.$transaction;
  t.after(() => { prisma.$transaction = original; });
  prisma.$transaction = async (run) => run({
    $queryRaw: async (strings, ...values) => {
      calls.push({ sql: strings.join("?"), values });
      return calls.length === 1 ? [{ total: 21n }] : [{ name: "O'Reilly_%" }];
    },
  });
  const result = await purchasesService.retailers({ query: { page: "2", pageSize: "20", search } });
  assert.deepEqual(result, {
    items: [search], pagination: { page: 2, pageSize: 20, total: 21, totalPages: 2 },
  });
  assert.deepEqual(calls[1].values, [search, 20, 20]);
  assert.ok(!calls[1].sql.includes(search));
  assert.match(calls[1].sql, /UNION SELECT name FROM InventoryRetailer/);
});

test("empty retailer pages return serializable pagination and clamp the offset", async (t) => {
  let calls = 0;
  const original = prisma.$transaction;
  t.after(() => { prisma.$transaction = original; });
  prisma.$transaction = async (run) => run({
    $queryRaw: async (_strings, ...values) => {
      if (++calls === 1) return [{ total: 0n }];
      assert.deepEqual(values, ["", 20, 0]);
      return [];
    },
  });
  const result = await purchasesService.retailers({ query: { page: "5", pageSize: "20" } });
  assert.deepEqual(result, { items: [], pagination: { page: 1, pageSize: 20, total: 0, totalPages: 1 } });
  assert.doesNotThrow(() => JSON.stringify(result));
});

test("retailer pagination rejects an unbounded page size", async () => {
  await assert.rejects(purchasesService.retailers({ query: { pageSize: "101" } }));
});
