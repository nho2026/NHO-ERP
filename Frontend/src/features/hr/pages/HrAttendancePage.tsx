import { DeleteConfirmationDialog } from "@/features/attendance/components/DeleteConfirmationDialog";
import { useCallback, useMemo, useState } from "react";
import {
  CalendarDays,
  Clock3,
  Link2,
  LogIn,
  LogOut,
  Search,
  TimerOff,
  UsersRound,
  LayoutGrid,
  List,
  BriefcaseBusiness,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { attendancePermissionsApi, hrApi, type HrRecord } from "../api/hr.api";
import { attendanceApi } from "@/features/attendance/api/attendance.api";
import { useApiResource } from "@/shared/hooks/useApiResource";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { MonthPicker } from "@/shared/components/ui/month-picker";
import { FormDatePicker } from "@/shared/components/ui/form-date-picker";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { toast } from "sonner";
import { hasPermission, storedUser } from "@/features/auth/access";
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
  const canDeletePermission = storedUser()?.roles?.some(
    (role) => role.name === "Super Administrator",
  );
  const [deletingPermission, setDeletingPermission] = useState<HrRecord | null>(
    null,
  );
  const canManage = hasPermission(storedUser(), "employees.manage");
  const [month, setMonth] = useState(monthValue());
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [attendanceFilter, setAttendanceFilter] = useState("all");
  const [directoryView, setDirectoryView] = useState<"grid" | "table">("grid");
  const [selected, setSelected] = useState<HrRecord>();
  const [permissionOpen, setPermissionOpen] = useState(false);
  const [permissionType, setPermissionType] = useState("full_day");
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
  const permissions = useApiResource(
    useCallback(
      () =>
        attendancePermissionsApi.list({
          from: `${month}-01`,
          to: `${month}-31`,
        }),
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
  const departmentOptions = Array.from(
    new Map(
      (employees.data ?? []).flatMap((employee) => {
        const department = employee.department as {
          id: string;
          name: string;
        } | null;
        return department ? [[department.id, department.name] as const] : [];
      }),
    ).entries(),
  ).sort((a, b) => a[1].localeCompare(b[1], i18n.resolvedLanguage));
  const visible = (employees.data ?? []).filter((employee) => {
    const matchesSearch =
      employeeLabel(employee)
        .toLowerCase()
        .includes(search.trim().toLowerCase()) ||
      String(employee.employeeCode)
        .toLowerCase()
        .includes(search.trim().toLowerCase());
    const department = employee.department as { id: string } | null;
    const departmentId = employee.departmentId ?? department?.id;
    if (
      !matchesSearch ||
      (departmentFilter === "none"
        ? Boolean(departmentId)
        : departmentFilter !== "all" && departmentId !== departmentFilter)
    )
      return false;
    const records = monthRecords.filter(
      (record) => record.employeeId === employee.id,
    );
    if (attendanceFilter === "recorded") return records.length > 0;
    if (attendanceFilter === "noRecords") return records.length === 0;
    if (attendanceFilter === "late")
      return records.some((record) => Number(record.lateMinutes ?? 0) > 0);
    if (attendanceFilter === "missingCheckout")
      return records.some((record) => record.checkIn && !record.checkOut);
    return true;
  });
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
    (total, record) => total + lostMinutes(record, permissions.data ?? []),
    0,
  );
  const linkedEmployees = new Set(
    (people.data ?? []).flatMap((person) =>
      person.employeeId ? [person.employeeId] : [],
    ),
  );
  const totalLost = monthRecords.reduce(
    (total, record) => total + lostMinutes(record, permissions.data ?? []),
    0,
  );
  const isLoading = employees.isLoading || people.isLoading || events.isLoading;
  const grantPermission = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selected) return;
    const form = new FormData(event.currentTarget);
    try {
      await attendancePermissionsApi.create({
        employeeId: selected.id,
        permissionType,
        fromDate: String(form.get("date")),
        toDate: String(form.get("date")),
        permittedMinutes:
          permissionType === "hours"
            ? Number(form.get("hours") ?? 0) * 60
            : null,
        reason: String(form.get("reason") ?? "") || null,
        status: "approved",
      });
      setPermissionOpen(false);
      await permissions.refresh();
      toast.success(tx("permissionGranted", "Attendance permission granted."));
    } catch {
      toast.error(
        tx("permissionError", "Unable to grant attendance permission."),
      );
    }
  };

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
            <span className="grid size-10 place-items-center rounded-xl bg-teal-500/10 text-teal-600">
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
      <Card>
        <CardContent className="flex flex-wrap items-end gap-4 p-4">
          <div className="min-w-48 flex-1 space-y-2">
            <Label htmlFor="attendance-department-filter">
              {tx("filterDepartment", "Department")}
            </Label>
            <Select
              value={departmentFilter}
              onValueChange={setDepartmentFilter}
              dir={i18n.dir()}
            >
              <SelectTrigger
                id="attendance-department-filter"
                className="w-full"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {tx("allDepartments", "All departments")}
                </SelectItem>
                <SelectItem value="none">
                  {tx("noDepartment", "No department")}
                </SelectItem>
                {departmentOptions.map(([id, name]) => (
                  <SelectItem key={id} value={id}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="min-w-56 flex-1 space-y-2">
            <Label htmlFor="attendance-status-filter">
              {tx("monthlyAttendanceFilter", "Attendance in selected month")}
            </Label>
            <Select
              value={attendanceFilter}
              onValueChange={setAttendanceFilter}
              dir={i18n.dir()}
            >
              <SelectTrigger id="attendance-status-filter" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries({
                  all: "All employees",
                  recorded: "Has attendance records",
                  noRecords: "No attendance records",
                  late: "Late arrival",
                  missingCheckout: "Missing check-out",
                }).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {tx(`attendanceFilter_${value}`, label)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setSearch("");
              setDepartmentFilter("all");
              setAttendanceFilter("all");
            }}
            disabled={
              !search &&
              departmentFilter === "all" &&
              attendanceFilter === "all"
            }
          >
            {tx("clearFilters", "Clear filters")}
          </Button>
          <p className="text-sm text-muted-foreground" role="status">
            {t("hrMonthly.filteredEmployees", {
              count: visible.length,
              total: employees.data?.length ?? 0,
            })}
          </p>
        </CardContent>
      </Card>
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
        <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute inset-s-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-11 bg-card ps-9 shadow-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={tx("searchEmployee", "Search employee or code…")}
            />
          </div>
          <div className="flex rounded-xl border bg-card p-1 shadow-xs">
            <Button
              size="sm"
              variant={directoryView === "grid" ? "default" : "ghost"}
              onClick={() => setDirectoryView("grid")}
            >
              <LayoutGrid />
              {tx("gridView", "Grid")}
            </Button>
            <Button
              size="sm"
              variant={directoryView === "table" ? "default" : "ghost"}
              onClick={() => setDirectoryView("table")}
            >
              <List />
              {tx("tableView", "Table")}
            </Button>
          </div>
        </div>
      </div>
      {(employees.error || people.error || events.error) && (
        <p className="text-sm text-destructive">
          {employees.error || people.error || events.error}
        </p>
      )}
      {directoryView === "grid" ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {isLoading &&
            Array.from({ length: 6 }, (_, index) => (
              <Skeleton key={index} className="h-28 rounded-2xl" />
            ))}
          {visible.map((employee) => {
            const records = recordsFor(employee.id);
            const lost = records.reduce(
              (sum, row) => sum + lostMinutes(row, permissions.data ?? []),
              0,
            );
            return (
              <button
                key={employee.id}
                onClick={() => setSelected(employee)}
                className="group text-start"
              >
                <Card className="relative h-full overflow-hidden border-0 bg-card shadow-sm ring-1 ring-border/70 transition duration-200 before:absolute before:inset-y-0 before:start-0 before:w-1 before:bg-linear-to-b before:from-primary before:to-teal-400 group-hover:-translate-y-0.5 group-hover:ring-primary/35 group-hover:shadow-md">
                  <CardContent className="flex min-h-28 items-center gap-3 p-4 ps-5">
                    <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-linear-to-br from-primary/15 to-teal-500/10 text-sm font-bold text-primary ring-1 ring-primary/15">
                      {String(employee.firstName ?? "E").charAt(0)}
                      {String(employee.lastName ?? "").charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-bold">
                          {employeeLabel(employee)}
                        </p>
                        <span
                          className={`size-2 shrink-0 rounded-full ${linkedEmployees.has(employee.id) ? "bg-emerald-500" : "bg-slate-300"}`}
                          title={
                            linkedEmployees.has(employee.id)
                              ? tx("linked", "Linked")
                              : tx("notLinked", "Not linked")
                          }
                        />
                      </div>
                      <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                        {employee.user
                          ? `@${String((employee.user as HrRecord).username)}`
                          : tx("noSystemUser", "No system user")}
                      </p>
                      <p className="mt-1.5 flex items-center gap-1.5 truncate text-xs">
                        <BriefcaseBusiness className="size-3.5 shrink-0 text-primary" />
                        {String(
                          (employee.position as HrRecord | null)?.name ??
                            tx("noPosition", "No position"),
                        )}
                      </p>
                      <p className="mt-1 text-[10px] font-medium text-muted-foreground">
                        {String(employee.employeeCode)} ·{" "}
                        {people.data?.filter(
                          (person) => person.employeeId === employee.id,
                        ).length ?? 0}{" "}
                        {tx("deviceUsers", "device users")}
                      </p>
                    </div>
                    <div className="shrink-0 border-s ps-3 text-end">
                      <p className="text-[10px] text-muted-foreground">
                        {tx("lostTime", "Lost time")}
                      </p>
                      <p className="mt-1 text-sm font-bold text-destructive">
                        {duration(lost)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{tx("employee", "Employee")}</TableHead>
                <TableHead>{tx("employeeCode", "Code")}</TableHead>
                <TableHead>{tx("position", "Position")}</TableHead>
                <TableHead>{tx("account", "Account")}</TableHead>
                <TableHead>{tx("deviceUsers", "Device users")}</TableHead>
                <TableHead className="text-end">
                  {tx("lostTime", "Lost time")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((employee) => {
                const lost = recordsFor(employee.id).reduce(
                  (sum, row) => sum + lostMinutes(row, permissions.data ?? []),
                  0,
                );
                return (
                  <TableRow
                    key={employee.id}
                    className="cursor-pointer"
                    onClick={() => setSelected(employee)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="grid size-9 place-items-center rounded-xl bg-primary/10 font-bold text-primary">
                          {String(employee.firstName ?? "E").charAt(0)}
                          {String(employee.lastName ?? "").charAt(0)}
                        </span>
                        <span className="font-semibold">
                          {employeeLabel(employee)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{String(employee.employeeCode)}</TableCell>
                    <TableCell>
                      {String(
                        (employee.position as HrRecord | null)?.name ??
                          tx("noPosition", "No position"),
                      )}
                    </TableCell>
                    <TableCell>
                      {employee.user
                        ? `@${String((employee.user as HrRecord).username)}`
                        : tx("noSystemUser", "No system user")}
                    </TableCell>
                    <TableCell>
                      {people.data?.filter(
                        (person) => person.employeeId === employee.id,
                      ).length ?? 0}
                    </TableCell>
                    <TableCell className="text-end font-bold text-destructive">
                      {duration(lost)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
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
            {canManage && (
              <Button
                className="absolute end-16 top-6"
                onClick={() => setPermissionOpen(true)}
              >
                <ShieldCheck /> {tx("grantPermission", "Grant permission")}
              </Button>
            )}
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
            {selected &&
              permissions.data?.some(
                (permission) => permission.employeeId === selected.id,
              ) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {permissions.data
                    .filter(
                      (permission) => permission.employeeId === selected.id,
                    )
                    .map((permission) => (
                      <Badge
                        key={permission.id}
                        variant="outline"
                        className="gap-2 bg-background py-1.5"
                      >
                        <ShieldCheck className="size-3.5 text-emerald-600" />
                        {tx(
                          String(permission.permissionType),
                          String(permission.permissionType).replaceAll(
                            "_",
                            " ",
                          ),
                        )}
                        : {String(permission.fromDate).slice(0, 10)}
                        {String(permission.fromDate).slice(0, 10) !==
                          String(permission.toDate).slice(0, 10) &&
                          ` — ${String(permission.toDate).slice(0, 10)}`}
                        {canDeletePermission && (
                          <button
                            type="button"
                            aria-label={t("common.delete")}
                            onClick={() => setDeletingPermission(permission)}
                          >
                            <Trash2 className="size-3.5 text-destructive" />
                          </button>
                        )}
                      </Badge>
                    ))}
                </div>
              )}
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
                const dayPermissions = (permissions.data ?? []).filter(
                  (permission) =>
                    permission.employeeId === selected?.id &&
                    permission.status === "approved" &&
                    String(permission.fromDate).slice(0, 10) <= dateKey &&
                    String(permission.toDate).slice(0, 10) >= dateKey,
                );
                const lost = row ? lostMinutes(row, permissions.data ?? []) : 0;
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
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs ${dayPermissions.length ? "bg-emerald-100 font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-background/70 text-muted-foreground"}`}
                        >
                          {dayPermissions.length
                            ? tx(
                                String(dayPermissions[0].permissionType),
                                String(
                                  dayPermissions[0].permissionType,
                                ).replaceAll("_", " "),
                              )
                            : tx("noRecord", "No record")}
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
      <DeleteConfirmationDialog
        alwaysRequirePassword
        key={deletingPermission?.id ?? "no-permission"}
        open={!!deletingPermission}
        title={t("common.deletePermanently")}
        description={
          deletingPermission
            ? `${tx(String(deletingPermission.permissionType), String(deletingPermission.permissionType))}: ${String(deletingPermission.fromDate).slice(0, 10)} — ${String(deletingPermission.toDate).slice(0, 10)}`
            : ""
        }
        onOpenChange={(open) => {
          if (!open) setDeletingPermission(null);
        }}
        onConfirm={async (password) => {
          if (!deletingPermission) return;
          await attendancePermissionsApi.remove(
            deletingPermission.id,
            password,
          );
          await permissions.refresh();
        }}
      />
      <Dialog open={permissionOpen} onOpenChange={setPermissionOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {tx("grantPermission", "Grant attendance permission")}
            </DialogTitle>
          </DialogHeader>
          <form className="grid gap-4" onSubmit={grantPermission}>
            <Label className="grid gap-2">
              {tx("permissionType", "Permission type")}
              <Select value={permissionType} onValueChange={setPermissionType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full_day">
                    {tx("full_day", "Full day")}
                  </SelectItem>
                  <SelectItem value="hours">{tx("hours", "Hours")}</SelectItem>
                </SelectContent>
              </Select>
            </Label>
            <Label className="grid gap-2">
              {tx("date", "Date")}
              <FormDatePicker name="date" required />
            </Label>
            {permissionType === "hours" && (
              <Label className="grid gap-2">
                {tx("permittedHours", "Permitted hours per day")}
                <Input
                  name="hours"
                  type="number"
                  min="0.25"
                  max="24"
                  step="0.25"
                  required
                />
              </Label>
            )}
            <Label className="grid gap-2">
              {tx("reason", "Reason")}
              <Textarea name="reason" />
            </Label>
            <Button type="submit">
              <ShieldCheck />
              {tx("savePermission", "Save permission")}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
