import { test } from 'node:test';
import assert from 'node:assert/strict';
import { departmentSchema } from '../src/modules/healthcare/healthcare.schema.js';
import { healthcareModel as model } from '../src/modules/healthcare/healthcare.model.js';
import { healthcareService as service } from '../src/modules/healthcare/healthcare.service.js';
test('department type accepts only hospital or office and preserves partial updates', () => {
  for (const type of ['hospital', 'office']) assert.equal(departmentSchema.parse({ code: 'DEP-1', name: 'Test', type }).type, type);
  assert.equal(departmentSchema.safeParse({ code: 'DEP-1', name: 'Test', type: 'other' }).success, false);
  assert.equal(departmentSchema.partial().parse({ name: 'Updated' }).type, undefined);
});
test('clinical assignments reject Office and allow Hospital', async t => {
  t.mock.method(model, 'getDepartment', async id => ({ type: id }));
  const create = t.mock.method(model, 'createStaff', async data => data);
  t.mock.method(model, 'assignDepartment', async () => {});
  await assert.rejects(service.createStaff({ employeeId: 'employee', departmentId: 'office', staffType: 'doctor' }), /Hospital/);
  assert.equal(create.mock.callCount(), 0);
  await service.createStaff({ employeeId: 'employee', departmentId: 'hospital', staffType: 'nurse' });
  assert.equal(create.mock.callCount(), 1);
});
test('existing departments can be reclassified without moving linked records', async t => {
  const update = t.mock.method(model, 'updateDepartment', async (id, data) => ({ id, ...data }));
  const assign = t.mock.method(model, 'assignDepartment', async () => {});
  assert.deepEqual(await service.updateDepartment('department', { type: 'office' }), { id: 'department', type: 'office' });
  assert.equal(update.mock.callCount(), 1);
  assert.equal(assign.mock.callCount(), 0);
});
test('existing clinical profiles remain editable but new Office assignments are rejected', async t => {
  t.mock.method(model, 'getStaff', async () => ({ departmentId: 'old-office', employeeId: 'employee' }));
  t.mock.method(model, 'getDepartment', async () => ({ type: 'office' }));
  const update = t.mock.method(model, 'updateStaff', async (id, data) => ({ id, employeeId: 'employee', ...data }));
  t.mock.method(model, 'assignDepartment', async () => {});
  await service.updateStaff('staff', { biography: 'Updated' });
  await service.updateStaff('staff', { departmentId: 'old-office' });
  await assert.rejects(service.updateStaff('staff', { departmentId: 'new-office' }), /Hospital/);
  assert.equal(update.mock.callCount(), 2);
});
test('department codes are generated numerically and retried on collision', async t => {
  const { prisma } = await import('../src/shared/database/client.js');
  const mock = (name, fn) => { const original = prisma.department[name]; prisma.department[name] = fn; t.after(() => { prisma.department[name] = original; }); };
  let attempt = 0;
  mock('findMany', async () => [{ code: 'DEP-9' }, { code: attempt ? 'DEP-11' : 'DEP-10' }, { code: 'OLD' }]);
  mock('findUnique', async () => null);
  mock('create', async ({ data }) => {
    if (attempt++ === 0) throw Object.assign(new Error('collision'), { code: 'P2002' });
    return data;
  });
  assert.equal((await model.createDepartment({ name: 'Office', code: 'DEP-1' })).code, 'DEP-12');
});
test('editing a department preserves its assigned code', async t => {
  t.mock.method(model, 'updateDepartment', async (id, data) => data);
  assert.deepEqual(await service.updateDepartment('id', { code: 'DEP-99', name: 'Updated' }), { name: 'Updated' });
});
