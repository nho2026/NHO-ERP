import { test } from 'node:test';
import assert from 'node:assert/strict';
import { patientUpdateSchema } from '../src/modules/crm/crm.schema.js';
test('patient status updates preserve unrelated patient fields', () => {
  assert.deepEqual(patientUpdateSchema.parse({ status: 'inactive' }), { status: 'inactive' });
  assert.deepEqual(patientUpdateSchema.parse({ firstName: 'Updated' }), { firstName: 'Updated' });
  assert.deepEqual(patientUpdateSchema.parse({ hasDiabetes: false, childrenCount: 0 }), { hasDiabetes: false, childrenCount: 0 });
});
test('patient status rejects unsupported values', () => {
  assert.equal(patientUpdateSchema.safeParse({ status: 'invalid' }).success, false);
});
test('patient progress accepts every appointment workflow stage', () => {
  for (const status of ['new', 'contacted', 'qualified', 'appointment_requested', 'surgery_appointment', 'converted', 'direct_surgery_converted']) {
    assert.deepEqual(patientUpdateSchema.parse({ status }), { status });
  }
});
