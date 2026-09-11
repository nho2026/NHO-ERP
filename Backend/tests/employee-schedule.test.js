import test from "node:test";
import assert from "node:assert/strict";
import { employeeSchema } from "../src/modules/hr/employees/employees.schema.js";

test("dynamic schedules accept hours without fixed times", () => {
  const schema = employeeSchema.partial();
  assert.equal(schema.safeParse({ scheduleType: "dynamic", workSchedule: [{ day: 1, hours: 4 }] }).success, true);
  for (const hours of [0, -1, 25]) assert.equal(schema.safeParse({ workSchedule: [{ day: 1, hours }] }).success, false);
});

test("employee schedules accept different shifts on two working days", () => {
  const input = {
    scheduleType: "dynamic",
    workSchedule: [
      { day: 1, checkInTime: "08:00", checkOutTime: "15:00" },
      { day: 2, checkInTime: "11:00", checkOutTime: "15:00" },
    ],
  };
  assert.deepEqual(employeeSchema.partial().parse(input), { ...input, status: "active" });
});

test("employee schedules reject empty days, duplicate weekdays and invalid times", () => {
  const day = { day: 1, checkInTime: "08:00", checkOutTime: "15:00" };
  for (const workSchedule of [
    [],
    [day, day],
    [{ ...day, day: 7 }],
    [{ ...day, checkOutTime: "25:00" }],
    [{ ...day, checkOutTime: "08:00" }],
  ]) {
    assert.equal(
      employeeSchema.partial().safeParse({ workSchedule }).success,
      false,
    );
  }
});
