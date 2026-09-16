import assert from "node:assert/strict";
import { test } from "node:test";
import bcrypt from "bcryptjs";
import { prisma } from "../src/shared/database/client.js";
import { authService } from "../src/modules/auth/auth.service.js";
import { withLoginLockout } from "../src/modules/auth/login-lockout.js";

// Prisma delegates expose methods through a proxy, without method descriptors.
function replace(t, target, name, implementation) {
  const original = target[name];
  target[name] = implementation;
  t.after(() => { target[name] = original; });
}

for (const method of ["credentials", "pin"]) {
  test(`${method} login uses only the held transaction connection`, async (t) => {
    const user = {
      id: "test-user", username: "test", status: "active",
      passwordHash: await bcrypt.hash("test-password", 4),
      pinHash: await bcrypt.hash("123456", 4),
      roles: [{ role: { id: "admin", name: "Super Administrator", permissions: [] } }],
    };
    let inTransaction = false;
    let settingsReads = 0;
    const outsideLookup = async () => {
      assert.equal(inTransaction, false, "must not acquire another pool connection");
      return user;
    };
    replace(t, prisma.user, "findFirst", outsideLookup);
    replace(t, prisma.user, "findUnique", outsideLookup);
    replace(t, prisma.systemSetting, "findUnique", async () => {
      assert.fail("settings must reuse the transaction connection");
    });
    const tx = {
      user: { findFirst: async () => user, findUnique: async () => user },
      systemSetting: { findUnique: async () => { settingsReads++; return null; } },
      $executeRaw: async () => 1,
      $queryRaw: async (_sql, id) => [{ id, attempts: 0, expiresAt: new Date(0) }],
    };
    replace(t, prisma, "$transaction", async (run) => {
      inTransaction = true;
      try { return await run(tx); } finally { inTransaction = false; }
    });
    const input = method === "credentials"
      ? { method, username: "test", password: "test-password", remember: false }
      : { method, pin: "123456" };
    const result = await withLoginLockout(input, "test-source", (db) => authService.login(input, db));
    assert.equal(result.user.id, user.id);
    assert.equal(typeof result.token, "string");
    assert.equal(settingsReads, 1);
  });
}

test("a locked source still rejects login before verifying credentials", async (t) => {
  replace(t, prisma.user, "findFirst", async () => null);
  const tx = {
    $executeRaw: async () => 1,
    $queryRaw: async (_sql, id) => [{ id, attempts: 4, expiresAt: new Date(Date.now() + 60_000) }],
  };
  replace(t, prisma, "$transaction", async (run) => run(tx));
  await assert.rejects(
    withLoginLockout({ method: "credentials", username: "test" }, "test-source", async () => {
      assert.fail("locked login must not run");
    }),
    (error) => error.status === 429 && error.retryAfter > 0,
  );
});
