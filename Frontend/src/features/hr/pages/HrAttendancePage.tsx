import { useCallback, useMemo, useState } from "react";
import {
  CalendarDays,
  Clock3,
  Link2,
  LogIn,
  LogOut,
  Search,
  TimerOff,
  UserRound,
  UsersRound,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { hrApi, type HrRecord } from "../api/hr.api";
import { attendanceApi } from "@/features/attendance/api/attendance.api";
import { useApiResource } from "@/shared/hooks/useApiResource";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { MonthPicker } from "@/shared/components/ui/month-picker";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  duration,
  deviceAttendanceRecords,
  employeeLabel,
  lostMinutes,
  monthValue,
} from "./monthly-hr";

const time = (value: unknown) =>
  value
    ? new Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(String(value)))
    : "—";

export default function HrAttendancePage() {
  const { t, i18n } = useTranslation();
  const tx = (key: string, fallback: string) =>
    t(`hrMonthly.${key}`, { defaultValue: fallback });
  const [month, setMonth] = useState(monthValue());
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<HrRecord>();
  const employees = useApiResource(
    useCallback(() => hrApi.employees.list(), []),
  );
  const people = useApiResource(useCallback(() => attendanceApi.people(), []));
  const events = useApiResource(
    useCallback(
      () => attendanceApi.events({ from: `${month}-01`, to: `${month}-31` }),
      [month],
    ),
  );
  const monthRecords = useMemo(
    () =>
      deviceAttendanceRecords(
        events.data ?? [],
        people.data ?? [],
        employees.data ?? [],
        month,
      ),
    [events.data, people.data, employees.data, month],
  );
  const visible = (employees.data ?? []).filter(
    (employee) =>
      employeeLabel(employee).toLowerCase().includes(search.toLowerCase()) ||
      String(employee.employeeCode)
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  const recordsFor = (id: string) =>
    monthRecords.filter((x) => x.employeeId === id);
  const [year, monthNumber] = month.split("-").map(Number);
  const days = Array.from(
    { length: new Date(year, monthNumber, 0).getDate() },
    (_, index) => new Date(year, monthNumber - 1, index + 1),
  );
  const firstOffset = new Date(year, monthNumber - 1, 1).getDay();
  const selectedRecords = selected ? recordsFor(selected.id) : [];
  const selectedWorked = selectedRecords.reduce(
    (total, record) => total + Number(record.workedMinutes ?? 0),
    0,
  );
  const selectedLost = selectedRecords.reduce(
    (total, record) => total + lostMinutes(record),
    0,
  );
  const linkedEmployees = new Set(
    (people.data ?? []).flatMap((person) =>
      person.employeeId ? [person.employeeId] : [],
    ),
  );
  const totalLost = monthRecords.reduce(
    (total, record) => total + lostMinutes(record),
    0,
  );
  const isLoading = employees.isLoading || people.isLoading || events.isLoading;

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border bg-linear-to-br from-primary/12 via-background to-background p-6 shadow-sm sm:p-7">
        <div className="pointer-events-none absolute -end-16 -top-20 size-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <CalendarDays className="size-5" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                  {tx("workforce", "Workforce")}
                </p>
                <h1 className="text-2xl font-bold sm:text-3xl">
                  {tx("attendanceTitle", "Employee attendance")}
                </h1>
              </div>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              {tx(
                "attendanceSubtitle",
                "Select an employee to view check-ins, check-outs and lost time for every day of the month.",
              )}
            </p>
          </div>
          <label className="space-y-1.5 text-xs font-semibold">
            <span className="text-muted-foreground">
              {tx("attendanceMonth", "Attendance month")}
            </span>
            <MonthPicker
              value={month}
              onValueChange={setMonth}
              locale={i18n.resolvedLanguage}
              label={tx("attendanceMonth", "Attendance month")}
              className="w-full min-w-52"
            />
          </label>
        </div>
        <div className="relative mt-6 grid gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-2xl border bg-background/80 p-4 backdrop-blur">
            <span className="grid size-10 place-items-center rounded-xl bg-blue-500/10 text-blue-600">
              <UsersRound className="size-5" />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">
                {tx("totalEmployees", "Employees")}
              </p>
              <p className="text-xl font-bold">{employees.data?.length ?? 0}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border bg-background/80 p-4 backdrop-blur">
            <span className="grid size-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <Link2 className="size-5" />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">
                {tx("linkedEmployees", "Device linked")}
              </p>
              <p className="text-xl font-bold">{linkedEmployees.size}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border bg-background/80 p-4 backdrop-blur">
            <span className="grid size-10 place-items-center rounded-xl bg-red-500/10 text-red-600">
              <TimerOff className="size-5" />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">
                {tx("monthlyLostTime", "Monthly lost time")}
              </p>
              <p className="text-xl font-bold text-destructive">
                {duration(totalLost)}
              </p>
            </div>
          </div>
        </div>
      </section>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-bold">
            {tx("employeeDirectory", "Employee directory")}
          </h2>
          <p className="text-xs text-muted-foreground">
            {tx(
              "selectCard",
              "Select a card to open monthly attendance details.",
            )}
          </p>
        </div>
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute inset-s-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-11 bg-card ps-9 shadow-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={tx("searchEmployee", "Search employee or code…")}
          />
        </div>
      </div>
      {(employees.error || people.error || events.error) && (
        <p className="text-sm text-destructive">
          {employees.error || people.error || events.error}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {isLoading &&
          Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-32 rounded-2xl" />
          ))}
        {visible.map((employee) => {
          const records = recordsFor(employee.id);
          const lost = records.reduce((sum, row) => sum + lostMinutes(row), 0);
          return (
            <button
              key={employee.id}
              onClick={() => setSelected(employee)}
              className="group text-start"
            >
              <Card className="h-full overflow-hidden transition duration-200 group-hover:-translate-y-1 group-hover:border-primary/40 group-hover:shadow-lg">
                <div className="h-1 bg-linear-to-r from-primary via-primary/60 to-transparent" />
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-4 ring-primary/5">
                    <UserRound className="size-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">
                      {employeeLabel(employee)}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {employee.user
                        ? `@${String((employee.user as HrRecord).username)}`
                        : tx("noSystemUser", "No system user")}{" "}
                      ·{" "}
                      {people.data?.filter(
                        (person) => person.employeeId === employee.id,
                      ).length ?? 0}{" "}
                      {tx("deviceUsers", "device users")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {String(employee.employeeCode)} ·{" "}
                      {String(
                        (employee.position as HrRecord | null)?.name ??
                          tx("noPosition", "No position"),
                      )}
                    </p>
                  </div>
                  <div className="text-end">
                    <p className="text-xs text-muted-foreground">
                      {tx("lostTime", "Lost time")}
                    </p>
                    <p className="font-semibold text-destructive">
                      {duration(lost)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </button>
          );
        })}
      </div>
      {!isLoading && !visible.length && (
        <div className="rounded-3xl border border-dashed py-16 text-center">
          <Search className="mx-auto mb-3 size-8 text-muted-foreground" />
          <p className="font-semibold">
            {tx("noEmployeesFound", "No employees found")}
          </p>
          <p className="text-sm text-muted-foreground">
            {tx("tryAnotherSearch", "Try another name or employee code.")}
          </p>
        </div>
      )}
      <Dialog
        open={Boolean(selected)}
        onOpenChange={(open) => !open && setSelected(undefined)}
      >
        <DialogContent className="max-h-[94vh] w-[min(96vw,1200px)] max-w-none gap-0 overflow-hidden border-0 p-0 shadow-2xl">
          <div className="border-b bg-linear-to-br from-primary/12 via-primary/5 to-background px-7 py-6 pe-16">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-4 text-2xl">
                <span className="grid size-12 place-items-center rounded-xl bg-primary text-primary-foreground shadow-md">
                  <CalendarDays className="size-6" />
                </span>
                <span>
                  <span className="block">
                    {selected && employeeLabel(selected)}
                  </span>
                  <span className="mt-1.5 block text-sm font-medium text-muted-foreground">
                    {String(selected?.employeeCode ?? "")} ·{" "}
                    {new Intl.DateTimeFormat(undefined, {
                      month: "long",
                      year: "numeric",
                    }).format(new Date(year, monthNumber - 1))}
                    {" · "}
                    {tx("schedule", "Schedule")}:{" "}
                    {String(selected?.checkInTime ?? "09:00")}–
                    {String(selected?.checkOutTime ?? "17:00")}
                  </span>
                </span>
              </DialogTitle>
            </DialogHeader>
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="rounded-xl border bg-background/80 p-4 shadow-sm">
                <p className="text-sm font-medium text-muted-foreground">
                  {tx("recordedDays", "Recorded days")}
                </p>
                <p className="mt-1.5 text-xl font-bold">
                  {selectedRecords.length}
                </p>
              </div>
              <div className="rounded-xl border bg-background/80 p-4 shadow-sm">
                <p className="text-sm font-medium text-muted-foreground">
                  {tx("workedTime", "Worked time")}
                </p>
                <p className="mt-1.5 text-xl font-bold text-emerald-600">
                  {duration(selectedWorked)}
                </p>
              </div>
              <div className="rounded-xl border bg-background/80 p-4 shadow-sm">
                <p className="text-sm font-medium text-muted-foreground">
                  {tx("lostTime", "Lost time")}
                </p>
                <p className="mt-1.5 text-xl font-bold text-destructive">
                  {duration(selectedLost)}
                </p>
              </div>
            </div>
          </div>
          <div className="content-scrollbar overflow-y-auto p-5 sm:p-6">
            <div className="mb-2 grid grid-cols-7 gap-2 text-center text-sm font-bold uppercase tracking-wide text-muted-foreground">
              {Array.from({ length: 7 }, (_, i) => (
                <div className="py-2" key={i}>
                  {new Intl.DateTimeFormat(undefined, {
                    weekday: "short",
                  }).format(new Date(2024, 0, 7 + i))}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: firstOffset }, (_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {days.map((day) => {
                const dateKey = `${month}-${String(day.getDate()).padStart(2, "0")}`;
                const row = recordsFor(selected?.id ?? "").find(
                  (x) => String(x.attendanceDate).slice(0, 10) === dateKey,
                );
                const lost = row ? lostMinutes(row) : 0;
                return (
                  <div
                    key={dateKey}
                    className={`min-h-26 rounded-xl border p-2.5 transition-colors ${row ? "border-primary/20 bg-card shadow-sm" : "border-transparent bg-muted/35"}`}
                  >
                    <div className="mb-1.5 flex items-center justify-between gap-1">
                      <span
                        className={`grid size-7 place-items-center rounded-lg text-sm font-bold ${row ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}
                      >
                        {day.getDate()}
                      </span>
                      {row && (
                        <Badge
                          variant="secondary"
                          className="px-2 py-0.5 text-[11px]"
                        >
                          {t(`hr.${String(row.status)}`, {
                            defaultValue: String(row.status),
                          })}
                        </Badge>
                      )}
                    </div>
                    {row ? (
                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center justify-between gap-1 text-muted-foreground">
                          <LogIn className="size-3.5 text-emerald-600" />
                          <span>{time(row.checkIn)}</span>
                        </div>
                        <div className="flex items-center justify-between gap-1 text-muted-foreground">
                          <LogOut className="size-3.5 text-amber-600" />
                          <span>{time(row.checkOut)}</span>
                        </div>
                        <div className="mt-1 flex items-center justify-between gap-1 border-t pt-1 font-semibold">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Clock3 className="size-3.5" />
                            {tx("worked", "Worked")}
                          </span>
                          <span>
                            {duration(Number(row.workedMinutes ?? 0))}
                          </span>
                        </div>
                        <div
                          className={`flex items-center justify-between gap-1 font-semibold ${lost ? "text-destructive" : "text-emerald-600"}`}
                        >
                          <span className="flex items-center gap-1">
                            <TimerOff className="size-3.5" />
                            {tx("lost", "Lost")}
                          </span>
                          <span>{duration(lost)}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="grid h-12 place-items-center">
                        <span className="rounded-full bg-background/70 px-2.5 py-1 text-xs text-muted-foreground">
                          {tx("noRecord", "No record")}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
