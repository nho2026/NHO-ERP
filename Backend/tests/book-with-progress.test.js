import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bookWithProgress } from '../src/modules/crm/patient/book-with-progress.js';
test('updates progress only after successful creation using the same transaction', async () => {
  const events = [];
  const tx = { patient: { update: async args => events.push(args) } };
  const db = { $transaction: async fn => fn(tx) };
  for (const status of ['appointment_requested', 'surgery_appointment']) {
    events.length = 0;
    const result = await bookWithProgress(db, 'patient', status, async client => {
      assert.equal(client, tx); events.push('created'); return { id: 'appointment' };
    });
    assert.deepEqual(events, ['created', { where: { id: 'patient' }, data: { status } }]);
    assert.equal(result.id, 'appointment');
  }
});
test('failed booking never updates patient status', async () => {
  let updated = false;
  const tx = { patient: { update: async () => { updated = true; } } };
  await assert.rejects(bookWithProgress({ $transaction: fn => fn(tx) }, 'patient', 'appointment_requested', async () => { throw new Error('Booking failed'); }), /Booking failed/);
  assert.equal(updated, false);
});
test('status failures propagate out of the transaction for rollback', async () => {
  const tx = { patient: { update: async () => { throw new Error('Status failed'); } } };
  await assert.rejects(bookWithProgress({ $transaction: fn => fn(tx) }, 'patient', 'surgery_appointment', async () => ({ id: 'appointment' })), /Status failed/);
});
