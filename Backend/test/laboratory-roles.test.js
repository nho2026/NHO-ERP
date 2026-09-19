import test from "node:test";
import assert from "node:assert/strict";
import policy from "../src/shared/constants/access-policy.json" with { type: "json" };
import { laboratoryRoles, seedLaboratoryRoles } from "../src/shared/security/laboratory-roles.js";
import { effectivePermissions, missingRequestPermissions, assignablePermissionCatalog } from "../src/shared/security/access-policy.js";

test("laboratory reception can use its pages and display without financial or result mutations", () => {
  const keys = effectivePermissions(laboratoryRoles[0].permissions);
  const allowed = Object.entries(policy.pages).filter(([path, module]) => path.startsWith('/laboratory') && keys.has(`${module}.view`)).map(([path]) => path).sort();
  assert.deepEqual(allowed, ['/laboratory', '/laboratory/display', '/laboratory/reception', '/laboratory/tickets']);
  for (const [method, url] of [['GET', '/laboratory/dashboard'], ['GET', '/laboratory/accounting-queue'], ['GET', '/laboratory/tests'], ['GET', '/laboratory/lookups/patients'], ['POST', '/laboratory/orders'], ['POST', '/laboratory/orders/id/call-ticket']]) {
    assert.deepEqual(missingRequestPermissions(keys, method, url), [], url);
  }
  for (const [method, url] of [['POST', '/laboratory/orders/id/pay'], ['PATCH', '/laboratory/orders/id/results'], ['POST', '/laboratory/tests']]) {
    assert.ok(missingRequestPermissions(keys, method, url).length, url);
  }
});

test("all laboratory role permissions are assignable", () => {
  const keys = new Set(assignablePermissionCatalog.map(({ key }) => key));
  for (const role of laboratoryRoles) for (const key of role.permissions) assert.ok(keys.has(key), key);
});

test("laboratory role seeding preserves existing customized grants", async () => {
  const writes = [];
  const tx = {
    permission: { findMany: async ({ where }) => where.key.in.map((id) => ({ id })) },
    role: { upsert: async (data) => writes.push(data) },
  };
  await seedLaboratoryRoles({ $transaction: async (run) => run(tx) });
  assert.equal(writes.length, 3);
  for (const write of writes) {
    assert.deepEqual(write.update, {});
    assert.ok(write.create.permissions.create.length);
  }
});
