import { test } from "node:test";
import assert from "node:assert/strict";
import { prisma } from "../src/shared/database/client.js";
import { eventsModel } from "../src/modules/attendance/events/events.model.js";

test("saving an attendance event looks up its nearest previous event without list query parameters", async t => {
  const original = prisma.$transaction;
  t.after(() => { prisma.$transaction = original; });
  const lookups = [];
  prisma.$transaction = async run => run({
    $queryRaw: async () => [],
    attendanceEvent: {
      findUnique: async () => null,
      findFirst: async args => { lookups.push(args); return null; },
      create: async ({data}) => ({id: "saved", ...data}),
    },
  });
  const occurredAt = new Date("2026-09-01T06:00:00Z");
  const result = await eventsModel.saveUnique("device", "serial", {employeeNo: "1", eventType: "check_in", occurredAt});
  assert.equal(result.created, true);
  assert.deepEqual(lookups[1].where.occurredAt, {lte: occurredAt});
  assert.deepEqual(lookups[1].orderBy, {occurredAt: "desc"});
  assert.deepEqual(lookups[2].orderBy, {occurredAt: "asc"});
});
