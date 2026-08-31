import type { HrRecord } from "../api/hr.api";
import type {
  AttendanceEvent,
  Person,
} from "@/features/attendance/api/attendance.api";

export const WORK_DAYS = 26;
export const HOURS_PER_DAY = 8;
export const PENALTY_MULTIPLIER = 3;
export const TARGET_MINUTES = HOURS_PER_DAY * 60;

export const monthValue = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

export const inMonth = (value: unknown, month: string) =>
  typeof value === "string" && value.slice(0, 7) === month;

export const lostMinutes = (record: HrRecord) => {
  if (record.status === "leave" || record.status === "holiday") return 0;
  if (record.status === "absent") return TARGET_MINUTES;
  if (record.source === "device")
    return Math.min(
      Number(record.expectedMinutes ?? TARGET_MINUTES),
      Number(record.lateMinutes ?? 0) + Number(record.earlyLeaveMinutes ?? 0),
    );
  return Math.max(0, TARGET_MINUTES - Number(record.workedMinutes ?? 0));
};

export const scheduledMinutes = (employee: HrRecord) => {
  const [startHour, startMinute] = String(employee.checkInTime ?? "09:00")
    .split(":")
    .map(Number);
  const [endHour, endMinute] = String(employee.checkOutTime ?? "17:00")
    .split(":")
    .map(Number);
  const start = startHour * 60 + startMinute;
  let end = endHour * 60 + endMinute;
  if (end <= start) end += 1440;
  return end - start;
};

export const duration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const rest = Math.round(minutes % 60);
  return `${hours}h ${rest}m`;
};

export const employeeLabel = (employee: HrRecord) =>
  `${String(employee.firstName ?? "")} ${String(employee.lastName ?? "")}`.trim();

export const activeSalaryFor = (
  employeeId: string,
  salaries: HrRecord[],
  month: string,
) => {
  const monthEnd = `${month}-31`;
  return salaries
    .filter(
      (salary) =>
        salary.employeeId === employeeId &&
        String(salary.effectiveFrom).slice(0, 10) <= monthEnd &&
        (!salary.effectiveTo ||
          String(salary.effectiveTo).slice(0, 7) >= month),
    )
    .sort((a, b) =>
      String(b.effectiveFrom).localeCompare(String(a.effectiveFrom)),
    )[0];
};

export const payrollAmounts = (
  baseSalary: number,
  minutesLost: number,
  hoursPerDay = HOURS_PER_DAY,
) => {
  const lostHours = minutesLost / 60;
  const hourlyRate = baseSalary / (WORK_DAYS * hoursPerDay);
  const deduction = hourlyRate * lostHours * PENALTY_MULTIPLIER;
  return {
    hourlyRate,
    deduction,
    netSalary: Math.max(0, baseSalary - deduction),
  };
};

const localDateKey = (value: string) => {
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

export const deviceAttendanceRecords = (
  events: AttendanceEvent[],
  people: Person[],
  employees: HrRecord[],
  month: string,
) => {
  const employeeByPerson = new Map(
    people
      .filter((person) => person.employeeId)
      .map((person) => [person.id, person.employeeId!]),
  );
  const groups = new Map<
    string,
    { employeeId: string; date: string; events: AttendanceEvent[] }
  >();
  const employeeById = new Map(
    employees.map((employee) => [employee.id, employee]),
  );
  for (const event of events) {
    const employeeId =
      event.person?.employeeId ??
      (event.person?.id ? employeeByPerson.get(event.person.id) : undefined);
    const date = localDateKey(event.occurredAt);
    if (!employeeId || !date.startsWith(month)) continue;
    const key = `${employeeId}:${date}`;
    const group = groups.get(key) ?? { employeeId, date, events: [] };
    group.events.push(event);
    groups.set(key, group);
  }
  return [...groups.values()].map(({ employeeId, date, events: records }) => {
    const ordered = records.sort(
      (a, b) =>
        new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime(),
    );
    const checkIn = ordered.find(
      (event) => event.eventType === "check_in",
    )?.occurredAt;
    const checkOut = ordered
      .filter((event) => event.eventType === "check_out")
      .at(-1)?.occurredAt;
    const workedMinutes =
      checkIn && checkOut
        ? Math.max(
            0,
            Math.round(
              (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
                60000,
            ),
          )
        : 0;
    const employee = employeeById.get(employeeId);
    const expectedMinutes = scheduledMinutes(
      employee ?? ({ id: employeeId } as HrRecord),
    );
    const [recordYear, recordMonth, recordDay] = date.split("-").map(Number);
    const expectedAt = (value: unknown) => {
      const [hour, minute] = String(value).split(":").map(Number);
      return new Date(
        recordYear,
        recordMonth - 1,
        recordDay,
        hour,
        minute,
      ).getTime();
    };
    const expectedCheckIn = expectedAt(employee?.checkInTime ?? "09:00");
    let expectedCheckOut = expectedAt(employee?.checkOutTime ?? "17:00");
    if (expectedCheckOut <= expectedCheckIn) expectedCheckOut += 86400000;
    const lateMinutes = checkIn
      ? Math.max(
          0,
          Math.round((new Date(checkIn).getTime() - expectedCheckIn) / 60000),
        )
      : expectedMinutes;
    const earlyLeaveMinutes = checkOut
      ? Math.max(
          0,
          Math.round((expectedCheckOut - new Date(checkOut).getTime()) / 60000),
        )
      : expectedMinutes;
    return {
      id: `device:${employeeId}:${date}`,
      employeeId,
      attendanceDate: date,
      checkIn: checkIn ?? null,
      checkOut: checkOut ?? null,
      workedMinutes,
      expectedMinutes,
      lateMinutes,
      earlyLeaveMinutes,
      status: "present",
      source: "device",
    } satisfies HrRecord;
  });
};
