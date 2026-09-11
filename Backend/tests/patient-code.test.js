import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createPatient, nextPatientNumber } from '../src/modules/crm/patient/patient-code.js';
test('patient numbering handles numeric ordering, padded and legacy codes', () => {
  assert.equal(nextPatientNumber([]), 1n);
  assert.equal(nextPatientNumber([{ patientCode: 'PAT-9' }, { patientCode: 'PAT-0010' }, { patientCode: 'LEAD-ABC' }]), 11n);
});
test('automatically assigns codes and retries code collisions', async () => {
  let calls = 0;
  const db = { patient: {
    findMany: async () => [{ patientCode: 'PAT-9' }],
    create: async ({ data }) => {
      if (calls++ === 0) throw { code: 'P2002', meta: { target: 'Patient_patientCode_key' } };
      return data;
    },
  } };
  assert.deepEqual(await createPatient(db, { firstName: 'Test', patientCode: 'custom' }), { firstName: 'Test', patientCode: 'PAT-11' });
});
test('unrelated uniqueness errors are not retried', async () => {
  let calls = 0;
  const error = { code: 'P2002', meta: { target: 'other_key' } };
  const db = { patient: { findMany: async () => [], create: async () => { calls++; throw error; } } };
  await assert.rejects(createPatient(db, {}), e => e === error);
  assert.equal(calls, 1);
});
