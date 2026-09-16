import { test } from "node:test";
import assert from "node:assert/strict";
import { prisma } from "../src/shared/database/client.js";
import { paginate, paginateRows, pageInput } from "../src/shared/database/paginate.js";
import { attendancePermissionModel } from "../src/modules/hr/attendance-permissions/attendance-permissions.model.js";
import { payrollAdjustmentModel } from "../src/modules/hr/payroll-adjustments/payroll-adjustments.model.js";
import { payrollModel } from "../src/modules/hr/payrolls/payrolls.model.js";
import { healthcareModel } from "../src/modules/healthcare/healthcare.model.js";

function replace(t, target, key, value) { const original = target[key]; target[key] = value; t.after(() => { target[key] = original; }); }
for(const [name, run, delegate, expected] of [
  ["permissions", query => attendancePermissionModel.findAll(query), "attendancePermission", { employeeId: "employee", status: "approved" }],
  ["adjustments", query => payrollAdjustmentModel.findAll(query), "payrollAdjustment", { year: 2026, month: 9, employeeId: "employee" }],
  ["payroll", query => payrollModel.findAll(query), "payroll", { year: 2026, month: 9 }],
  ["staff", query => healthcareModel.listStaff(query), "healthStaff", { staffType: "doctor", departmentId: "department" }],
]) test(`${name}: list filters never spread search field arrays into Prisma where`, async t => {
  const query = { employeeId: "employee", status: "approved", year: "2026", month: "9", staffType: "doctor", departmentId: "department" };
  replace(t, prisma[delegate], "findMany", async args => {
    assert.deepEqual(args.where, expected);
    return [];
  });
  await run(query);
  replace(t, prisma, "$transaction", async fn => fn({ [delegate]: {
    count: async ({where}) => { assert.deepEqual(where.AND[0], expected); assert.ok(where.AND[1].OR.length); return 21; },
    findMany: async args => { assert.equal(args.skip,20); assert.equal(args.take,20); return [{id:"last"}]; },
  } }));
  const result = await run({...query,page:"2",pageSize:"20",search:"Test"});
  assert.equal(result.pagination.total,21);
});
test("pagination clamps the final page, preserves scope, and overrides old fixed limits", async t => {
  replace(t,prisma,"$transaction",async fn => fn({ user: {
    count: async ({where}) => { assert.deepEqual(where.AND[0],{status:"active"}); return 21; },
    findMany: async args => { assert.equal(args.skip,20); assert.equal(args.take,20); assert.deepEqual(args.orderBy,[{name:"asc"},{id:"asc"}]); return [{id:"21"}]; },
  } }));
  const result=await paginate("user",{page:99,pageSize:20},{where:{status:"active"},take:1,orderBy:{name:"asc"}},["name"]);
  assert.equal(result.pagination.page,2);
});
test("invalid pagination fails before querying", () => {
  for(const query of [{page:0},{page:-1},{page:1.5},{pageSize:101},{page:"bad"}]) assert.throws(()=>pageInput(query),{status:400});
  assert.deepEqual(paginateRows([], {page:9}).pagination,{page:1,pageSize:20,total:0,totalPages:1});
});
