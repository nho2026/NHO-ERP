import { authModel } from "../src/modules/auth/auth.model.js";
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { prisma } from '../src/shared/database/client.js';
import { withLoginLockout, LOGIN_LOCK_MS } from '../src/modules/auth/login-lockout.js';

test('four failures block login, expiry permits retry, and success clears failures', async t => {
  t.mock.method(authModel, "findByPinLookup", async () => null);
  const records = new Map();
  const tx = {
    $executeRaw: async (sql, ...values) => {
      const statement = sql.join('?');
      if (statement.startsWith('INSERT')) {
        const [id, expiresAt] = values;
        if (!records.has(id)) records.set(id, { id, attempts: 0, expiresAt });
      } else if (statement.startsWith('UPDATE')) {
        const [attempts, expiresAt, id] = values;
        records.set(id, { id, attempts, expiresAt });
      } else records.delete(values[0]);
    },
    $queryRaw: async (_sql, id) => [records.get(id)],
  };
  const original = prisma.$transaction;
  prisma.$transaction = fn => fn(tx);
  t.after(() => { prisma.$transaction = original; });
  const input = { method: 'pin', pin: '111111' };
  let checked = 0;
  const invalid = async () => { checked++; throw Object.assign(new Error('Invalid PIN.'), { status: 401 }); };
  for (let i = 1; i <= 4; i++) await assert.rejects(withLoginLockout(input, 'test', invalid), e => e.status === (i === 4 ? 429 : 401));
  assert.equal(checked, 4);
  await assert.rejects(withLoginLockout(input, 'test', async () => { checked++; return 'valid'; }), e => e.status === 429 && e.retryAfter > 0);
  assert.equal(checked, 4);
  for (const row of records.values()) row.expiresAt = new Date(Date.now() - LOGIN_LOCK_MS);
  await assert.rejects(withLoginLockout(input, 'test', invalid), e => e.status === 401);
  assert.equal([...records.values()][0].attempts, 1);
  assert.equal(await withLoginLockout(input, 'test', async () => 'valid'), 'valid');
  assert.equal(records.size, 0);
});
