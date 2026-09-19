import test from "node:test";
import assert from "node:assert/strict";
import { leadFilterSchema } from "../src/modules/crm/lead/lead.schema.js";
import { leadService } from "../src/modules/crm/lead/lead.service.js";
import { leadModel } from "../src/modules/crm/lead/lead.model.js";

test("lead filters reject invalid dates, ranges and field values", () => {
  for (const query of [
    { fromDate: "2026-02-30" }, { fromDate: "invalid" },
    { fromDate: "2026-09-19", toDate: "2026-09-01" },
    { minAge: "50", maxAge: "20" }, { minAge: "-1" },
    { dateField: "phone" }, { contactMethod: "invalid" },
  ]) assert.throws(() => leadFilterSchema.parse(query), { name: "ZodError" });
  assert.equal(leadFilterSchema.parse({ minAge: "", maxAge: "" }).minAge, undefined);
});

test("lead dates and fields filter pagination and stage counts", async t => {
  let listWhere;
  t.mock.method(leadModel, "findAll", async (_skip, _take, where) => {
    listWhere = where;
    return [[], 0];
  });
  t.mock.method(leadModel, "counts", async where => {
    const { status, ...expected } = listWhere;
    assert.equal(status, "contacted");
    assert.deepEqual(where, expected);
    return [{ status: "new", _count: { _all: 3 } }];
  });
  const result = await leadService.list({
    summary: "true", status: "contacted", search: "Ali",
    dateField: "updatedAt", fromDate: "2026-09-01", toDate: "2026-09-19",
    minAge: "0", maxAge: "40", city: "Erbil", country: "Iraq",
    contactMethod: "whatsapp", patientType: "surgical",
    leadSourceChannel: "digital", referralPersona: "doctor",
  });
  assert.deepEqual(listWhere.updatedAt, {
    gte: new Date("2026-09-01T00:00:00Z"),
    lt: new Date("2026-09-20T00:00:00Z"),
  });
  assert.deepEqual(listWhere.age, { gte: 0, lte: 40 });
  assert.deepEqual(listWhere.city, { contains: "Erbil" });
  assert.deepEqual(listWhere.country, { contains: "Iraq" });
  assert.equal(listWhere.contactMethod, "whatsapp");
  assert.equal(listWhere.patientType, "surgical");
  assert.equal(listWhere.leadSourceChannel, "digital");
  assert.equal(listWhere.referralPersona, "doctor");
  assert.equal(listWhere.OR.length, 5);
  assert.deepEqual(result.counts, { new: 3 });
});

test("lead date filtering defaults to creation and supports one-sided ranges", async t => {
  const conditions = [];
  t.mock.method(leadModel, "findAll", async (_skip, _take, where) => {
    conditions.push(where);
    return [[], 0];
  });
  await leadService.list({ fromDate: "2026-09-01" });
  await leadService.list({ toDate: "2026-12-31" });
  await leadService.list({});
  assert.deepEqual(conditions, [
    { createdAt: { gte: new Date("2026-09-01T00:00:00Z") } },
    { createdAt: { lt: new Date("2027-01-01T00:00:00Z") } },
    {},
  ]);
});
