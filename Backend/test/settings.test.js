import assert from "node:assert/strict";
import { test } from "node:test";
import { defaults, schemas } from "../src/modules/settings/settings.schema.js";
import { signToken, verifyToken } from "../src/shared/security/token.js";
import { isSuperAdmin } from "../src/modules/settings/settings.service.js";

test("every settings category validates defaults and rejects unknown fields", () => {
  assert.equal(Object.keys(defaults).length, 8);
  for (const [key, value] of Object.entries(defaults)) {
    assert.deepEqual(schemas[key].strict().parse(value), value);
    assert.equal(
      schemas[key].strict().safeParse({ ...value, injected: true }).success,
      false,
    );
  }
});
test("invalid meeting, booking, timezone and backup policies are rejected", () => {
  for (const [key, patch] of [
    ["meetings", { participantLimit: 0 }],
    ["meetings", { videoQuality: "4k" }],
    ["healthcare", { bookingEnd: "08:00" }],
    ["system", { timezone: "Invalid/Timezone" }],
    ["system", { backupRetentionDays: 0 }],
    ["organization", { logo: "javascript:alert(1)" }],
    ["finance", { invoicePrefix: "../bad" }],
  ])
    assert.equal(
      schemas[key].safeParse({ ...defaults[key], ...patch }).success,
      false,
    );
});
test("only the actual superadmin role qualifies for system administration", () => {
  assert.equal(
    Boolean(isSuperAdmin({ roles: [{ role: { name: "HR" } }] })),
    false,
  );
  assert.equal(
    isSuperAdmin({ roles: [{ role: { name: "Super Administrator" } }] }),
    true,
  );
});
test("session tokens use the configured expiry", () => {
  const decoded = verifyToken(signToken("test-user", false, 3600));
  assert.equal(decoded.exp - decoded.iat, 3600);
});
