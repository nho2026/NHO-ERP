import assert from "node:assert/strict";
import { test, mock } from "node:test";
import { hashSecret } from "../src/shared/security/password.js";
import { attendancePermissionModel } from "../src/modules/hr/attendance-permissions/attendance-permissions.model.js";
import { attendancePermissionService } from "../src/modules/hr/attendance-permissions/attendance-permissions.service.js";
import { attendancePermissionController } from "../src/modules/hr/attendance-permissions/attendance-permissions.controller.js";

test("attendance permission deletion requires the signed-in superadmin's password", async (t) => {
  t.after(() => mock.restoreAll());
  const remove = mock.method(attendancePermissionModel, "remove", async () => {});
  const user = {
    roles: [{ role: { name: "Super Administrator" } }],
    passwordHash: await hashSecret("correct-password"),
  };
  for (const password of [undefined, "", "incorrect-password"]) {
    await assert.rejects(attendancePermissionService.remove("permission-1", user, password));
  }
  await assert.rejects(
    attendancePermissionService.remove("permission-1", { ...user, roles: [{ role: { name: "HR" } }] }, "correct-password"),
    { status: 403 },
  );
  assert.equal(remove.mock.callCount(), 0);
  let status;
  await attendancePermissionController.remove(
    { params: { id: "permission-1" }, user, body: { password: "correct-password" } },
    { status(value) { status = value; return this; }, end() {} },
    (error) => { throw error; },
  );
  assert.equal(status, 204);
  assert.deepEqual(remove.mock.calls[0].arguments, ["permission-1"]);
});
