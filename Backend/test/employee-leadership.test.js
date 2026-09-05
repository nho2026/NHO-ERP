import assert from "node:assert/strict";
import { test, mock } from "node:test";
const prisma = {
  systemSetting: { findUnique: async () => null },
  employee: {
    create: async () => {},
    update: async () => {},
    findUnique: async () => {},
  },
};
globalThis.__nhoPrisma = prisma;
const { employeeModel } =
  await import("../src/modules/hr/employees/employees.model.js");

test("employees can be created without a leader, while self-leadership is rejected", async (t) => {
  t.after(() => mock.restoreAll());
  const create = mock.method(prisma.employee, "create", async ({ data }) => ({
    id: "employee-1",
    ...data,
  }));
  const update = mock.method(
    prisma.employee,
    "update",
    async ({ data }) => data,
  );
  const lookup = mock.method(prisma.employee, "findUnique", async () => ({
    isTeamLeader: true,
    departmentId: "department-1",
  }));
  for (const teamLeaderId of [null, undefined, ""]) {
    await employeeModel.create({ firstName: "Test", teamLeaderId });
  }
  assert.equal(create.mock.callCount(), 3);
  assert.equal(lookup.mock.callCount(), 0);
  await assert.rejects(
    employeeModel.update("employee-1", { teamLeaderId: "employee-1" }),
    { status: 422 },
  );
  assert.equal(update.mock.callCount(), 0);
  await employeeModel.update("employee-1", { teamLeaderId: null });
  assert.deepEqual(update.mock.calls[0].arguments[0].data.teamLeader, {
    disconnect: true,
  });
  await employeeModel.create({
    departmentId: "department-1",
    teamLeaderId: "leader-1",
  });
  await assert.rejects(
    employeeModel.create({
      departmentId: "department-2",
      teamLeaderId: "leader-1",
    }),
    { status: 422 },
  );
});
