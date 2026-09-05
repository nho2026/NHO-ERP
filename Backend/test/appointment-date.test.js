import assert from "node:assert/strict";
import { test } from "node:test";
import { ensureAppointmentDate } from "../src/modules/crm/appointments/appointments.service.js";

test("appointments reject previous days but allow today and future dates", () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  assert.throws(() => ensureAppointmentDate(yesterday), { status: 400 });
  assert.throws(() => ensureAppointmentDate(yesterday, tomorrow), {
    status: 400,
  });
  assert.doesNotThrow(() => ensureAppointmentDate(today));
  assert.doesNotThrow(() => ensureAppointmentDate(tomorrow));
  assert.doesNotThrow(() => ensureAppointmentDate(yesterday, yesterday));
  assert.doesNotThrow(() => ensureAppointmentDate(undefined, yesterday));
});
