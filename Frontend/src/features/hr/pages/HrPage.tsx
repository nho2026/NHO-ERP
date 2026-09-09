import { settingsSnapshot } from "@/features/settings/settings";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Gift, Pencil, Plus, Printer, Search, Trash2 } from "lucide-react";
import { hrApi, type HrRecord } from "../api/hr.api";
import { usersApi } from "@/features/access-control/api/access.api";
import { healthcareApi } from "@/features/healthcare/api/healthcare.api";
import { printDocument } from "@/features/accounting/components/print-document";
import { apiErrorMessage } from "@/shared/api/client";
import { useApiResource } from "@/shared/hooks/useApiResource";
import { TableResourceState } from "@/shared/components/ui/table-resource-state";
import { FormDatePicker } from "@/shared/components/ui/form-date-picker";
import { DeleteConfirmationDialog } from "@/shared/components/ui/confirmation-dialog";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import logo from "@/assets/icons/logo.png";
import { EmployeeScheduleFields } from "../components/EmployeeScheduleFields";

type Resource = keyof typeof hrApi;
type Field = {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  options?: string[];
};
const configs: Record<
  Resource,
  { title: string; fields: Field[]; columns: [string, string][] }
> = {
  employees: {
    title: "Employees",
    fields: [
      { name: "userId", label: "System user", type: "systemUser" },
      { name: "employeeCode", label: "Employee code", required: true },
      { name: "firstName", label: "First name", required: true },
      { name: "lastName", label: "Last name", required: true },
      { name: "departmentId", label: "Department", type: "department" },
      { name: "positionId", label: "Position", type: "position" },
      {
        name: "isTeamLeader",
        label: "Team leader",
        type: "boolean",
        options: ["true", "false"],
      },
      { name: "teamLeaderId", label: "Reports to", type: "teamLeader" },
      { name: "hireDate", label: "Hire date", type: "date", required: true },
      {
        name: "checkInTime",
        label: "Expected check-in",
        type: "time",
        required: true,
      },
      {
        name: "checkOutTime",
        label: "Expected check-out",
        type: "time",
        required: true,
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: ["active", "inactive", "terminated"],
      },
    ],
    columns: [
      ["employeeCode", "Code"],
      ["fullName", "Employee"],
      ["position", "Position"],
      ["department", "Department"],
      ["leadership", "Team leader"],
      ["teamLeader", "Reports to"],
      ["hireDate", "Hire date"],
      ["workSchedule", "Working days"],
      ["checkInTime", "Expected check-in"],
      ["checkOutTime", "Expected check-out"],
      ["status", "Status"],
    ],
  },
  positions: {
    title: "Positions",
    fields: [
      { name: "name", label: "Position name", required: true },
      { name: "description", label: "Description" },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: ["active", "inactive"],
      },
    ],
    columns: [
      ["name", "Position"],
      ["description", "Description"],
      ["employeesCount", "Employees"],
      ["status", "Status"],
    ],
  },
  salaries: {
    title: "Salaries",
    fields: [
      {
        name: "employeeId",
        label: "Employee",
        type: "employee",
        required: true,
      },
      {
        name: "baseSalary",
        label: "Base salary",
        type: "number",
        required: true,
      },
      { name: "currencyId", label: "Currency", required: true },
      {
        name: "payType",
        label: "Pay type",
        type: "select",
        options: ["monthly", "daily", "hourly"],
      },
    ],
    columns: [
      ["employee", "Employee"],
      ["baseSalary", "Base salary"],
      ["currencyId", "Currency"],
      ["payType", "Pay type"],
    ],
  },
  attendance: {
    title: "HR attendance",
    fields: [
      {
        name: "employeeId",
        label: "Employee",
        type: "employee",
        required: true,
      },
      { name: "attendanceDate", label: "Date", type: "date", required: true },
      { name: "checkIn", label: "Check in", type: "datetime-local" },
      { name: "checkOut", label: "Check out", type: "datetime-local" },
      { name: "workedMinutes", label: "Worked minutes", type: "number" },
      { name: "lateMinutes", label: "Late minutes", type: "number" },
      {
        name: "earlyLeaveMinutes",
        label: "Early leave minutes",
        type: "number",
      },
      { name: "overtimeMinutes", label: "Overtime minutes", type: "number" },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: ["present", "absent", "leave", "holiday"],
      },
    ],
    columns: [
      ["employee", "Employee"],
      ["attendanceDate", "Date"],
      ["checkIn", "Check in"],
      ["checkOut", "Check out"],
      ["workedMinutes", "Worked"],
      ["status", "Status"],
    ],
  },
  payrolls: {
    title: "Payrolls",
    fields: [
      {
        name: "employeeId",
        label: "Employee",
        type: "employee",
        required: true,
      },
      { name: "salaryId", label: "Salary", type: "salary", required: true },
      { name: "year", label: "Year", type: "number", required: true },
      { name: "month", label: "Month", type: "number", required: true },
      {
        name: "baseSalary",
        label: "Base salary",
        type: "number",
        required: true,
      },
      { name: "overtimeAmount", label: "Overtime amount", type: "number" },
      { name: "bonusAmount", label: "Bonus amount", type: "number" },
      { name: "allowanceAmount", label: "Allowance amount", type: "number" },
      { name: "lateDeduction", label: "Late deduction", type: "number" },
      { name: "absenceDeduction", label: "Absence deduction", type: "number" },
      { name: "otherDeduction", label: "Other deduction", type: "number" },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: ["draft", "approved", "paid"],
      },
    ],
    columns: [
      ["employee", "Employee"],
      ["period", "Period"],
      ["grossSalary", "Gross"],
      ["totalDeduction", "Deductions"],
      ["netSalary", "Net"],
      ["status", "Status"],
    ],
  },
  adjustments: {
    title: "Rewards & punishments",
    fields: [
      {
        name: "employeeId",
        label: "Employee",
        type: "employee",
        required: true,
      },
      {
        name: "type",
        label: "Type",
        type: "select",
        options: ["reward", "punishment"],
        required: true,
      },
      { name: "amount", label: "Amount", type: "number", required: true },
      { name: "reason", label: "Reason", type: "textarea", required: true },
    ],
    columns: [
      ["employee", "Employee"],
      ["appliedAt", "Date & time"],
      ["type", "Type"],
      ["amount", "Amount"],
      ["reason", "Reason"],
    ],
  },
  advances: {
    title: "Salary advances",
    fields: [
      {
        name: "employeeId",
        label: "Employee",
        type: "employee",
        required: true,
      },
      {
        name: "amount",
        label: "Advance amount",
        type: "number",
        required: true,
      },
      { name: "currency", label: "Currency", required: true },
      {
        name: "requestedAt",
        label: "Requested date",
        type: "date",
        required: true,
      },
      { name: "approvedAt", label: "Approved date", type: "date" },
      {
        name: "deductionStartDate",
        label: "Deduction start date",
        type: "date",
      },
      {
        name: "installments",
        label: "Installments",
        type: "number",
        required: true,
      },
      { name: "deductedAmount", label: "Deducted amount", type: "number" },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: [
          "requested",
          "approved",
          "active",
          "completed",
          "rejected",
          "cancelled",
        ],
      },
      { name: "notes", label: "Notes" },
    ],
    columns: [
      ["employee", "Employee"],
      ["amount", "Advance amount"],
      ["installments", "Installments"],
      ["deductedAmount", "Deducted"],
      ["remainingAmount", "Remaining"],
      ["status", "Status"],
    ],
  },
};

const dateValue = (value: unknown, withTime = false) =>
  value
    ? new Date(String(value)).toISOString().slice(0, withTime ? 16 : 10)
    : "";
const employeeName = (record: HrRecord) => {
  const employee = record.employee as HrRecord | undefined;
  return employee ? `${employee.firstName} ${employee.lastName}` : "—";
};
function display(record: HrRecord, key: string): string | number {
  if (key === "workSchedule" && Array.isArray(record.workSchedule)) {
    return (record.workSchedule as { day: number }[])
      .map(({ day }) =>
        new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(
          new Date(2026, 0, 4 + day),
        ),
      )
      .join(", ");
  }
  if (
    ["checkInTime", "checkOutTime"].includes(key) &&
    record.scheduleType === "dynamic" &&
    Array.isArray(record.workSchedule)
  ) {
    return (
      record.workSchedule as {
        day: number;
        hours?: number;
        checkInTime: string;
        checkOutTime: string;
      }[]
    )
      .map(
        (day) =>
          `${new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(new Date(2026, 0, 4 + day.day))}: ${day.hours != null ? `${day.hours} h` : key === "checkInTime" ? day.checkInTime : day.checkOutTime}`,
      )
      .join(" · ");
  }
  if (key === "fullName") return `${record.firstName} ${record.lastName}`;
  if (key === "employee") return employeeName(record);
  if (key === "position")
    return String((record.position as HrRecord | null)?.name ?? "—");
  if (key === "department")
    return String((record.department as HrRecord | null)?.name ?? "—");
  if (key === "leadership") return record.isTeamLeader ? "Yes" : "No";
  if (key === "teamLeader") {
    const leader = record.teamLeader as HrRecord | null;
    return leader ? `${leader.firstName} ${leader.lastName}` : "—";
  }
  if (key === "employeesCount")
    return Number((record._count as HrRecord | undefined)?.employees ?? 0);
  if (key === "period")
    return `${record.year}/${String(record.month).padStart(2, "0")}`;
  const value = record[key];
  if (value == null || value === "") return "—";
  if (
    /Date$|At$|^(checkIn|checkOut|effectiveFrom|effectiveTo|startDate|endDate)$/.test(
      key,
    )
  )
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      ...(key === "checkIn" || key === "checkOut"
        ? { timeStyle: "short" }
        : {}),
    }).format(new Date(String(value)));
  if (/salary|amount|deduction/i.test(key))
    return Number(value).toLocaleString();
  return String(value);
}

export default function HrPage({ resource }: { resource?: Resource }) {
  const { t } = useTranslation();
  const tr = (text: string) => {
    const key = text
      .toLowerCase()
      .replace(/[^a-z0-9]+(.)/g, (_match, character: string) =>
        character.toUpperCase(),
      );
    return t(`hr.${key}`, { defaultValue: text });
  };
  const [selectedTab, setSelectedTab] = useState<Resource>("employees");
  const tab = resource ?? selectedTab;
  const [editing, setEditing] = useState<HrRecord | null | undefined>();
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [positionFilter, setPositionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [adjustmentEmployee, setAdjustmentEmployee] = useState<HrRecord | null>(
    null,
  );
  const positions = useApiResource(
    useCallback(() => hrApi.positions.list(), []),
  );
  const employees = useApiResource(
    useCallback(() => hrApi.employees.list(), []),
  );
  const salaries = useApiResource(useCallback(() => hrApi.salaries.list(), []));
  const users = useApiResource(useCallback(() => usersApi.list(), []));
  const departments = useApiResource(
    useCallback(() => healthcareApi.departments.list(), []),
  );
  const resources = {
    positions,
    employees,
    salaries,
    attendance: useApiResource(useCallback(() => hrApi.attendance.list(), [])),
    payrolls: useApiResource(useCallback(() => hrApi.payrolls.list(), [])),
    adjustments: useApiResource(
      useCallback(() => hrApi.adjustments.list(), []),
    ),
    advances: useApiResource(useCallback(() => hrApi.advances.list(), [])),
  };
  const current = resources[tab];
  const rows = useMemo(
    () =>
      (current.data ?? []).filter((row) => {
        if (
          !JSON.stringify(row)
            .toLowerCase()
            .includes(search.trim().toLowerCase())
        )
          return false;
        return (
          tab !== "employees" ||
          ((departmentFilter === "all" ||
            row.departmentId === departmentFilter) &&
            (positionFilter === "all" || row.positionId === positionFilter) &&
            (statusFilter === "all" || row.status === statusFilter))
        );
      }),
    [current.data, search, tab, departmentFilter, positionFilter, statusFilter],
  );
  const options = (field: Field) =>
    field.type === "systemUser"
      ? users.data?.map((user) => [user.id, `${user.name} — @${user.username}`])
      : field.type === "department"
        ? departments.data?.map((department) => [
            department.id,
            String(department.name),
          ])
        : field.type === "employee"
          ? (employees.data ?? [])
              .filter(
                (employee) =>
                  tab !== "salaries" ||
                  employee.id === editing?.employeeId ||
                  (salaries.data != null &&
                    !salaries.data.some(
                      (salary) => salary.employeeId === employee.id,
                    )),
              )
              .map((e) => [
                e.id,
                `${e.employeeCode} — ${e.firstName} ${e.lastName}`,
              ])
          : field.type === "teamLeader"
            ? employees.data
                ?.filter((e) => e.isTeamLeader && e.id !== editing?.id)
                .map((e) => [
                  e.id,
                  `${e.employeeCode} — ${e.firstName} ${e.lastName}`,
                ])
            : field.type === "position"
              ? positions.data?.map((p) => [p.id, String(p.name)])
              : field.type === "salary"
                ? salaries.data?.map((s) => [
                    s.id,
                    `${employeeName(s)} — ${s.baseSalary} ${s.currencyId}`,
                  ])
                : field.options?.map((v) => [
                    v,
                    field.type === "boolean"
                      ? v.charAt(0).toUpperCase() + v.slice(1)
                      : v,
                  ]);
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const data: Record<string, unknown> = {};
    for (const field of configs[tab].fields) {
      const rawValue = String(form.get(field.name) ?? "");
      const raw = rawValue === "__none__" ? "" : rawValue;
      if (!raw && !field.required) {
        data[field.name] = null;
        continue;
      }
      data[field.name] =
        field.type === "number"
          ? Number(raw || 0)
          : field.type === "boolean"
            ? raw === "true"
            : raw;
    }
    try {
      if (tab === "employees") {
        data.scheduleType = form.get("scheduleType");
        data.workSchedule = JSON.parse(
          String(form.get("workSchedule") ?? "[]"),
        );
      }
      if (editing) await hrApi[tab].update(editing.id, data);
      else await hrApi[tab].create(data);
      setEditing(undefined);
      await Promise.all([
        current.refresh(),
        employees.refresh(),
        positions.refresh(),
        salaries.refresh(),
      ]);
    } catch (cause) {
      setError(apiErrorMessage(cause));
    } finally {
      setBusy(false);
    }
  };
  const visibleResources = resource
    ? [resource]
    : (Object.keys(configs) as Resource[]);
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">{tr(configs[tab].title)}</h1>
        <p className="text-sm text-muted-foreground">
          {t("hr.pageDescription")}
        </p>
      </div>
      <Tabs
        value={tab}
        onValueChange={(value) => {
          setSelectedTab(value as Resource);
          setSearch("");
        }}
      >
        {!resource && (
          <TabsList className="h-auto flex-wrap">
            {visibleResources.map((key) => (
              <TabsTrigger key={key} value={key}>
                {tr(configs[key].title)}
              </TabsTrigger>
            ))}
          </TabsList>
        )}
        {visibleResources.map((key) => (
          <TabsContent key={key} value={key}>
            <Card>
              <CardContent className="p-0">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b p-4">
                  <div className="relative w-full max-w-sm">
                    <Search className="absolute inset-s-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      className="ps-9"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={t("hr.search", {
                        entity: tr(configs[key].title),
                      })}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    {key === "salaries" && (
                      <Button variant="outline" onClick={printDocument}>
                        <Printer className="size-4" />
                        {t("hr.printSalaryList")}
                      </Button>
                    )}
                    <Button
                      onClick={() => {
                        setError("");
                        setEditing(null);
                      }}
                    >
                      <Plus className="size-4" />
                      {t("hr.addRecord")}
                    </Button>
                  </div>
                </div>
                {key === "employees" && (
                  <div className="flex flex-wrap items-center gap-3 border-b p-4">
                    <Select
                      value={departmentFilter}
                      onValueChange={setDepartmentFilter}
                    >
                      <SelectTrigger
                        className="w-full sm:w-56"
                        aria-label={tr("Department")}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          {t("hr.allDepartments")}
                        </SelectItem>
                        {(departments.data ?? []).map((department) => (
                          <SelectItem key={department.id} value={department.id}>
                            {String(department.name)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={positionFilter}
                      onValueChange={setPositionFilter}
                    >
                      <SelectTrigger
                        className="w-full sm:w-56"
                        aria-label={tr("Position")}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          {t("hr.allPositions")}
                        </SelectItem>
                        {(positions.data ?? []).map((position) => (
                          <SelectItem key={position.id} value={position.id}>
                            {String(position.name)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger
                        className="w-full sm:w-48"
                        aria-label={tr("Status")}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          {t("hr.allStatuses")}
                        </SelectItem>
                        {["active", "inactive", "terminated"].map((status) => (
                          <SelectItem key={status} value={status}>
                            {tr(status)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {(search ||
                      departmentFilter !== "all" ||
                      positionFilter !== "all" ||
                      statusFilter !== "all") && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearch("");
                          setDepartmentFilter("all");
                          setPositionFilter("all");
                          setStatusFilter("all");
                        }}
                      >
                        {t("hr.clearFilters")}
                      </Button>
                    )}
                  </div>
                )}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {configs[key].columns.map(([, label]) => (
                          <TableHead key={label}>{tr(label)}</TableHead>
                        ))}
                        <TableHead>{t("hr.actions")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableResourceState
                        isLoading={current.isLoading}
                        error={current.error}
                        isEmpty={!rows.length}
                        colSpan={configs[key].columns.length + 1}
                      />
                      {!current.isLoading &&
                        !current.error &&
                        rows.map((row) => (
                          <TableRow key={row.id}>
                            {configs[key].columns.map(([field]) => (
                              <TableCell key={field}>
                                {field === "status" || field === "type" ? (
                                  <Badge variant="secondary">
                                    {tr(String(display(row, field)))}
                                  </Badge>
                                ) : (
                                  display(row, field)
                                )}
                              </TableCell>
                            ))}
                            <TableCell className="whitespace-nowrap">
                              <div className="flex flex-wrap items-center gap-2">
                                {key === "employees" && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    title={t("hr.rewardPunishment", {
                                      defaultValue: "Reward or punishment",
                                    })}
                                    onClick={() => {
                                      setError("");
                                      setAdjustmentEmployee(row);
                                    }}
                                  >
                                    <Gift className="size-4 text-amber-600" />
                                  </Button>
                                )}
                                <Button
                                  data-action="edit"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setError("");
                                    setEditing(row);
                                  }}
                                >
                                  <Pencil className="size-4" />
                                </Button>
                                <DeleteConfirmationDialog
                                  description={t("hr.deleteConfirm")}
                                  onConfirm={async () => {
                                    try {
                                      await hrApi[key].remove(row.id);
                                      await current.refresh();
                                    } catch (cause) {
                                      setError(apiErrorMessage(cause));
                                    }
                                  }}
                                >
                                  <Button
                                    data-action="delete"
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive"
                                  >
                                    <Trash2 className="size-4" />
                                  </Button>
                                </DeleteConfirmationDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
      <Dialog
        open={editing !== undefined}
        onOpenChange={(open) => {
          if (!open && !busy) setEditing(undefined);
        }}
      >
        <DialogContent
          className={`flex max-h-[90dvh] w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden p-0 ${tab === "employees" ? "max-w-5xl" : "max-w-lg"}`}
        >
          <DialogHeader className="shrink-0 border-b px-6 py-5 pe-14">
            <DialogTitle>
              {editing ? t("hr.editRecord") : t("hr.addRecord")} ·{" "}
              {tr(configs[tab].title)}
            </DialogTitle>
          </DialogHeader>
          <form
            className="flex min-h-0 flex-col overflow-hidden"
            onSubmit={submit}
          >
            <div
              className={`grid min-h-0 gap-4 overflow-y-auto overscroll-contain p-6 sm:grid-cols-2 ${tab === "employees" ? "lg:grid-cols-3" : ""}`}
            >
              {configs[tab].fields.map((field) => {
                if (
                  tab === "employees" &&
                  ["checkInTime", "checkOutTime"].includes(field.name)
                )
                  return null;
                const choices = options(field);
                const initial = editing?.[field.name];
                return (
                  <label
                    key={`${editing?.id ?? "new"}-${field.name}`}
                    className={`min-w-0 space-y-1 text-xs font-medium ${field.type === "textarea" || (tab === "adjustments" && field.name === "amount") ? "sm:col-span-2" : ""}`}
                  >
                    <span>{tr(field.label)}</span>
                    {choices ? (
                      <Select
                        name={field.name}
                        defaultValue={
                          initial != null
                            ? String(initial)
                            : field.required
                              ? undefined
                              : "__none__"
                        }
                        required={field.required}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={t("hr.selectField", {
                              field: tr(field.label),
                            })}
                          />
                        </SelectTrigger>
                        <SelectContent className="z-10000">
                          {!field.required && (
                            <SelectItem value="__none__">
                              {t("hr.none")}
                            </SelectItem>
                          )}
                          {choices.map(([value, label]) => (
                            <SelectItem
                              key={String(value)}
                              value={String(value)}
                            >
                              {field.options
                                ? tr(String(label))
                                : String(label)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : field.type === "textarea" ? (
                      <textarea
                        name={field.name}
                        defaultValue={String(initial ?? "")}
                        required={field.required}
                        rows={4}
                        className="flex w-full resize-y rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                      />
                    ) : field.type === "date" ||
                      field.type === "datetime-local" ? (
                      <FormDatePicker
                        name={field.name}
                        initialValue={
                          field.type === "date"
                            ? dateValue(initial)
                            : dateValue(initial, true)
                        }
                        includeTime={field.type === "datetime-local"}
                        required={field.required}
                      />
                    ) : (
                      <Input
                        name={field.name}
                        type={field.type ?? "text"}
                        step={field.type === "number" ? "0.01" : undefined}
                        min={field.type === "number" ? 0 : undefined}
                        defaultValue={String(
                          initial ??
                            (field.name === "checkInTime"
                              ? (settingsSnapshot()?.hr.startTime ?? "09:00")
                              : field.name === "checkOutTime"
                                ? (settingsSnapshot()?.hr.endTime ?? "17:00")
                                : ""),
                        )}
                        required={field.required}
                      />
                    )}
                  </label>
                );
              })}
              {tab === "employees" && (
                <EmployeeScheduleFields
                  key={editing?.id ?? "new"}
                  employee={editing}
                />
              )}
              {error && (
                <p className="col-span-full text-sm text-destructive">
                  {error}
                </p>
              )}
            </div>
            <div className="flex shrink-0 justify-end border-t bg-background px-6 py-4">
              <Button disabled={busy} className="w-full sm:w-auto sm:min-w-32">
                {busy ? t("hr.saving") : t("hr.save")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={Boolean(adjustmentEmployee)}
        onOpenChange={(open) => {
          if (!open && !busy) setAdjustmentEmployee(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("hr.rewardPunishment", {
                defaultValue: "Reward or punishment",
              })}{" "}
              · {adjustmentEmployee ? employeeName(adjustmentEmployee) : ""}
            </DialogTitle>
          </DialogHeader>
          <form
            className="grid gap-4"
            onSubmit={async (event) => {
              event.preventDefault();
              if (!adjustmentEmployee) return;
              const form = new FormData(event.currentTarget);
              setBusy(true);
              setError("");
              try {
                await hrApi.adjustments.create({
                  employeeId: adjustmentEmployee.id,
                  type: form.get("type"),
                  amount: Number(form.get("amount")),
                  reason: form.get("reason"),
                });
                setAdjustmentEmployee(null);
                await resources.adjustments.refresh();
              } catch (cause) {
                setError(apiErrorMessage(cause));
              } finally {
                setBusy(false);
              }
            }}
          >
            <label className="grid gap-1 text-sm font-medium">
              {t("hr.type", { defaultValue: "Type" })}
              <Select name="type" defaultValue="reward" required>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reward">
                    {t("hr.reward", { defaultValue: "Reward" })}
                  </SelectItem>
                  <SelectItem value="punishment">
                    {t("hr.punishment", { defaultValue: "Punishment" })}
                  </SelectItem>
                </SelectContent>
              </Select>
            </label>
            <label className="grid gap-1 text-sm font-medium">
              {t("hr.amount", { defaultValue: "Amount" })}
              <Input
                name="amount"
                type="number"
                min="0.01"
                step="0.01"
                required
              />
            </label>
            <label className="grid gap-1 text-sm font-medium">
              {t("hr.reason", { defaultValue: "Reason" })}
              <textarea
                name="reason"
                required
                rows={4}
                className="w-full resize-y rounded-md border bg-background px-3 py-2 text-sm"
              />
            </label>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button disabled={busy}>
              {busy ? t("hr.saving") : t("hr.save")}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      {tab === "salaries" && (
        <section className="print-document salary-list-print">
          <header>
            <div>
              <img
                className="print-logo h-[46px] w-[105px] rounded-[9px] border border-slate-200 bg-white px-2 py-1 object-contain object-center shadow-[0_4px_12px_rgba(15,23,42,0.14)]"
                src={logo}
                alt="NHO"
              />
              <p>{t("hr.salaryList")}</p>
            </div>
            <p>
              {t("hr.generatedAt")}:{" "}
              {new Intl.DateTimeFormat(undefined, { dateStyle: "long" }).format(
                new Date(),
              )}
            </p>
          </header>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>{t("hr.employee")}</th>
                <th>{t("hr.baseSalary")}</th>
                <th>{t("hr.currency")}</th>
                <th>{t("hr.payType")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.id}>
                  <td>{index + 1}</td>
                  <td>{employeeName(row)}</td>
                  <td>{Number(row.baseSalary).toLocaleString()}</td>
                  <td>{String(row.currencyId)}</td>
                  <td>{tr(String(row.payType))}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="salary-print-totals">
            <strong>{t("hr.totalsByCurrency")}</strong>
            {Object.entries(
              rows.reduce<Record<string, number>>((totals, row) => {
                const currency = String(row.currencyId ?? "—");
                totals[currency] =
                  (totals[currency] ?? 0) + Number(row.baseSalary ?? 0);
                return totals;
              }, {}),
            ).map(([currency, total]) => (
              <p key={currency}>
                <span>{currency}</span>
                <b>{total.toLocaleString()}</b>
              </p>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
