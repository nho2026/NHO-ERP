import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createWithCode, withoutCode } from '../src/shared/database/automatic-code.js';
test('all automatic record prefixes start at one and preserve create options', async () => {
  for (const [prefix, field] of [['EMP', 'employeeCode'], ['SUR', 'code'], ['WH', 'code'], ['CUS', 'code'], ['FRM', 'code'], ['SRV', 'code']]) {
    const model = { findMany: async () => [], create: async args => args };
    const result = await createWithCode(model, { data: { name: 'Test', [field]: 'manual' }, include: { relation: true } }, prefix, field);
    assert.equal(result.data[field], `${prefix}-1`);
    assert.deepEqual(result.include, { relation: true });
  }
});
test('uses numeric maximum and retries only code collisions', async () => {
  let calls = 0;
  const model = { findMany: async () => [{ employeeCode: 'EMP-9' }, { employeeCode: 'EMP-0010' }, { employeeCode: 'legacy' }], create: async args => {
    if (!calls++) throw { code: 'P2002', meta: { target: 'Employee_employeeCode_key' } };
    return args.data;
  } };
  assert.equal((await createWithCode(model, { data: {} }, 'EMP', 'employeeCode')).employeeCode, 'EMP-12');
  model.create = async () => { throw { code: 'P2002', meta: { target: 'email' } }; };
  await assert.rejects(createWithCode(model, { data: {} }, 'EMP', 'employeeCode'), error => error.meta.target === 'email');
});
test('updates strip generated codes without mutating input', () => {
  const data = { employeeCode: 'EMP-99', name: 'Changed' };
  assert.deepEqual(withoutCode(data, 'employeeCode'), { name: 'Changed' });
  assert.equal(data.employeeCode, 'EMP-99');
});
