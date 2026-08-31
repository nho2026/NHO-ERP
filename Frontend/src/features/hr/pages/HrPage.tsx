import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pencil, Plus, Printer, Search, Trash2 } from "lucide-react";
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
      {
        name: "effectiveFrom",
        label: "Effective from",
        type: "date",
        required: true,
      },
      { name: "effectiveTo", label: "Effective to", type: "date" },
    ],
    columns: [
      ["employee", "Employee"],
      ["baseSalary", "Base salary"],
      ["currencyId", "Currency"],
      ["payType", "Pay type"],
      ["effectiveFrom", "Effective from"],
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
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
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
    advances: useApiResource(useCallback(() => hrApi.advances.list(), [])),
  };
  const current = resources[tab];
  const rows = useMemo(
    () =>
      (current.data ?? []).filter((row) =>
        JSON.stringify(row).toLowerCase().includes(search.toLowerCase()),
      ),
    [current.data, search],
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
          ? employees.data?.map((e) => [
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
                : field.options?.map((v) => [v, v]);
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
                                {field === "status" ? (
                                  <Badge variant="secondary">
                                    {tr(String(display(row, field)))}
                                  </Badge>
                                ) : (
                                  display(row, field)
                                )}
                              </TableCell>
                            ))}
                            <TableCell className="whitespace-nowrap">
                              <Button
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
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive"
                                >
                                  <Trash2 className="size-4" />
                                </Button>
                              </DeleteConfirmationDialog>
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
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? t("hr.editRecord") : t("hr.addRecord")} ·{" "}
              {tr(configs[tab].title)}
            </DialogTitle>
          </DialogHeader>
          <form className="grid gap-3 sm:grid-cols-2" onSubmit={submit}>
            {configs[tab].fields.map((field) => {
              const choices = options(field);
              const initial = editing?.[field.name];
              return (
                <label
                  key={`${editing?.id ?? "new"}-${field.name}`}
                  className="space-y-1 text-xs font-medium"
                >
                  <span>{tr(field.label)}</span>
                  {choices ? (
                    <Select
                      name={field.name}
                      defaultValue={String(initial ?? "__none__")}
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
                          <SelectItem key={String(value)} value={String(value)}>
                            {field.options ? tr(String(label)) : String(label)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                            ? "09:00"
                            : field.name === "checkOutTime"
                              ? "17:00"
                              : ""),
                      )}
                      required={field.required}
                    />
                  )}
                </label>
              );
            })}
            {error && (
              <p className="sm:col-span-2 text-sm text-destructive">{error}</p>
            )}
            <Button disabled={busy} className="sm:col-span-2">
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
                <th>{t("hr.effectiveFrom")}</th>
                <th>{t("hr.effectiveTo")}</th>
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
                  <td>{display(row, "effectiveFrom")}</td>
                  <td>{display(row, "effectiveTo")}</td>
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
