import { test } from "node:test";
import assert from "node:assert/strict";
import { prisma } from "../src/shared/database/client.js";
import { transfersModel } from "../src/modules/inventory/transfers/transfers.model.js";

function replace(t, target, key, value) {
  const original = target[key];
  target[key] = value;
  t.after(() => { target[key] = original; });
}

test("transfer filters apply to both page rows and total count", async t => {
  const queries = [];
  replace(t, prisma.inventoryMovement, "findMany", async args => {
    queries.push(args);
    if (args.select) return [{ reference: "TR-match" }];
    if (args.where.movementType === "transfer_in") return [{ reference: "TR-match", warehouse: { id: "destination" } }];
    return [{ id: "movement", reference: "TR-match", quantity: -5 }];
  });
  let countWhere;
  replace(t, prisma.inventoryMovement, "count", async args => { countWhere = args.where; return 11; });
  replace(t, prisma, "$transaction", values => Promise.all(values));
  const result = await transfersModel.list({ page: "2", pageSize: "10", search: "A_10", fromWarehouseId: "source", toWarehouseId: "destination", startAt: "2026-09-01T21:00:00Z", endAt: "2026-09-03T21:00:00Z" });
  const rows = queries.find(args => args.where.movementType === "transfer_out");
  assert.deepEqual(rows.where, countWhere);
  assert.equal(rows.where.warehouseId, "source");
  assert.deepEqual(rows.where.reference, { in: ["TR-match"] });
  assert.equal(rows.where.OR[1].product.name.contains, "A\\_10");
  assert.equal(rows.where.occurredAt.lt.toISOString(), "2026-09-03T21:00:00.000Z");
  assert.equal(rows.skip, 10);
  assert.equal(rows.take, 10);
  assert.equal(result.pagination.totalPages, 2);
  assert.equal(result.items[0].toWarehouse.id, "destination");
  assert.equal(result.items[0].quantity, 5);
});

test("invalid transfer date ranges fail before database access", async () => {
  for (const query of [{startAt: "invalid"}, {startAt: "2026-09-03", endAt: "2026-09-01"}])
    await assert.rejects(transfersModel.list(query), {status: 400});
});
