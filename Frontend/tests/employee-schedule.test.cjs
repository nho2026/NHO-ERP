const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");
const source = fs.readFileSync(require("node:path").join(__dirname, "../src/features/hr/pages/monthly-hr.ts"), "utf8");
const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const sandbox = { exports: {}, require: () => ({ settingsSnapshot: () => ({ hr: { weekends: [5, 6], graceMinutes: 0 } }) }) };
vm.runInNewContext(output, sandbox);
const { deviceAttendanceRecords, lostMinutes, scheduleForDay } = sandbox.exports;
const employee = { id: "employee", scheduleType: "dynamic", checkInTime: "08:00", checkOutTime: "15:00", workSchedule: [
  { day: 1, checkInTime: "08:00", checkOutTime: "15:00" },
  { day: 2, checkInTime: "11:00", checkOutTime: "15:00" },
] };
test("four flexible hours accept any arrival time and exclude breaks", () => {
  const flexible = { ...employee, workSchedule: [{ day: 1, hours: 4 }] };
  const eventsFor = (times) => times.map(([eventType, time]) => ({ eventType, occurredAt: new Date(`2026-09-07T${time}:00`).toISOString(), person: { employeeId: "employee" } }));
  const full = deviceAttendanceRecords(eventsFor([["check_in", "11:00"], ["check_out", "15:00"]]), [], [flexible], "2026-09")[0];
  assert.equal(full.expectedMinutes, 240);
  assert.equal(full.lateMinutes, 0);
  assert.equal(lostMinutes(full), 0);
  const short = deviceAttendanceRecords(eventsFor([["check_in", "11:00"], ["check_out", "12:00"], ["check_in", "13:00"], ["check_out", "15:00"]]), [], [flexible], "2026-09")[0];
  assert.equal(short.workedMinutes, 180);
  assert.equal(lostMinutes(short), 60);
});
test("dynamic attendance uses each weekday's hours and has no off-day penalties", () => {
  const events = [[7, "08:00", "15:00"], [8, "11:00", "15:00"], [9, "12:00", "13:00"]].flatMap(([day, start, end]) => [
    { occurredAt: new Date(`2026-09-${String(day).padStart(2,"0")}T${start}:00`).toISOString(), eventType: "check_in", person: { employeeId: "employee" } },
    { occurredAt: new Date(`2026-09-${String(day).padStart(2,"0")}T${end}:00`).toISOString(), eventType: "check_out", person: { employeeId: "employee" } },
  ]);
  const records = deviceAttendanceRecords(events, [], [employee], "2026-09");
  assert.equal(records[0].expectedMinutes, 420);
  assert.equal(records[1].expectedMinutes, 240);
  assert.equal(records[1].lateMinutes, 0);
  assert.equal(records[2].expectedMinutes, 0);
  assert.equal(lostMinutes(records[2]), 0);
});
test("static schedules use shared times only on selected days", () => {
  assert.equal(scheduleForDay({ ...employee, scheduleType: "static" }, 2).checkInTime, "08:00");
  assert.equal(scheduleForDay(employee, 3), null);
  assert.equal(scheduleForDay({ id: "legacy", checkInTime: "08:00" }, 3).checkInTime, "08:00");
});
