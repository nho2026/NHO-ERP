import { test } from 'node:test';
import assert from 'node:assert/strict';
import { authService } from '../src/modules/auth/auth.service.js';
import { authModel } from '../src/modules/auth/auth.model.js';
import { userService } from '../src/modules/access-control/users/users.service.js';
import { userModel } from '../src/modules/access-control/users/users.model.js';
test('non-superadmins cannot log in using PIN', async t => {
  t.mock.method(authModel, 'findByPinLookup', async () => ({ roles: [{ role: { name: 'Administrator' } }] }));
  await assert.rejects(authService.login({ method: 'pin', pin: '123456' }), error => error.status === 401 && /superadmins/.test(error.message));
});
test('PIN assignment is rejected for ordinary roles', async t => {
  t.mock.method(userModel, 'hasSuperadminRole', async () => false);
  await assert.rejects(userService.create({ roleIds: ['employee'], pin: '123456', password: 'unused' }), /Only superadmins/);
  await assert.rejects(userService.update('user', { roleIds: ['employee'], pin: '123456' }), /Only superadmins/);
});
test('removing superadmin role clears PIN credentials', async t => {
  t.mock.method(userModel, 'hasSuperadminRole', async () => false);
  let saved;
  t.mock.method(userModel, 'update', async (_id, data) => { saved = data; return { id: 'user', roles: [] }; });
  await userService.update('user', { roleIds: ['employee'] });
  assert.equal(saved.pinHash, null);
  assert.equal(saved.pinLookup, null);
});
