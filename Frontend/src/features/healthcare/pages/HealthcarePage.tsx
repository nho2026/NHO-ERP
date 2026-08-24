import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { healthcareApi, type HealthcareRecord } from "../api/healthcare.api";
import { hrApi } from "@/features/hr/api/hr.api";
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

export type HealthcareResource = keyof typeof healthcareApi;
type Field = {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  options?: string[];
};
const configs: Record<
  HealthcareResource,
  {
    title: string;
    description: string;
    fields: Field[];
    columns: [string, string][];
  }
> = {
  departments: {
    title: "Departments",
    description:
      "Manage clinical departments, managers and assigned employees.",
    fields: [
      { name: "code", label: "Code", required: true },
      { name: "name", label: "Department name", required: true },
      { name: "description", label: "Description" },
      { name: "managerId", label: "Department manager", type: "employee" },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: ["active", "inactive"],
      },
    ],
    columns: [
      ["code", "Code"],
      ["name", "Department"],
      ["manager", "Manager"],
      ["employeeCount", "Employees"],
      ["staffCount", "Health staff"],
      ["status", "Status"],
    ],
  },
  staff: {
    title: "Doctors & health staff",
    description: "Create medical profiles from existing HR employees.",
    fields: [
      {
        name: "employeeId",
        label: "Employee",
        type: "employee",
        required: true,
      },
      { name: "departmentId", label: "Department", type: "department" },
      {
        name: "staffType",
        label: "Staff type",
        type: "select",
        options: [
          "doctor",
          "nurse",
          "technician",
          "pharmacist",
          "therapist",
          "other",
        ],
      },
      { name: "specialization", label: "Specialization" },
      { name: "licenseNumber", label: "License number" },
      { name: "biography", label: "Biography" },
      {
        name: "publicBookingEnabled",
        label: "Public booking",
        type: "boolean",
        options: ["true", "false"],
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: ["active", "inactive"],
      },
    ],
    columns: [
      ["employee", "Health professional"],
      ["staffType", "Staff type"],
      ["specialization", "Specialization"],
      ["department", "Department"],
      ["publicBookingEnabled", "Public booking"],
      ["status", "Status"],
    ],
  },
  appointments: {
    title: "Appointments",
    description: "Manage website and internally created patient appointments.",
    fields: [
      { name: "patientName", label: "Patient name", required: true },
      { name: "patientPhone", label: "Patient phone", required: true },
      { name: "patientEmail", label: "Patient email", type: "email" },
      {
        name: "departmentId",
        label: "Department",
        type: "department",
        required: true,
      },
      { name: "doctorId", label: "Doctor", type: "doctor", required: true },
      {
        name: "scheduledAt",
        label: "Appointment date & time",
        type: "datetime-local",
        required: true,
      },
      {
        name: "durationMinutes",
        label: "Duration minutes",
        type: "number",
        required: true,
      },
      { name: "reason", label: "Reason" },
      { name: "notes", label: "Notes" },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: ["pending", "confirmed", "completed", "cancelled", "no_show"],
      },
    ],
    columns: [
      ["patient", "Patient"],
      ["doctor", "Doctor"],
      ["department", "Department"],
      ["scheduledAt", "Date & time"],
      ["source", "Source"],
      ["status", "Status"],
    ],
  },
};

const personName = (record: HealthcareRecord | undefined | null) =>
  record ? `${record.firstName ?? ""} ${record.lastName ?? ""}`.trim() : "—";
const nested = (record: HealthcareRecord, key: string) =>
  record[key] as HealthcareRecord | undefined | null;
function display(record: HealthcareRecord, key: string): string | number {
  if (key === "manager") return personName(nested(record, "manager"));
  if (key === "employee") return personName(nested(record, "employee"));
  if (key === "patient")
    return `${record.patientName} · ${record.patientPhone}`;
  if (key === "doctor")
    return personName(
      nested(
        nested(record, "doctor") ?? ({ id: "" } as HealthcareRecord),
        "employee",
      ),
    );
  if (key === "department")
    return String(nested(record, "department")?.name ?? "—");
  if (key === "employeeCount")
    return Number(nested(record, "_count")?.employees ?? 0);
  if (key === "staffCount")
    return Number(nested(record, "_count")?.healthStaff ?? 0);
  if (key === "publicBookingEnabled")
    return record[key] ? "Enabled" : "Disabled";
  const value = record[key];
  if (value == null || value === "") return "—";
  if (key === "scheduledAt")
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(String(value)));
  return String(value).replaceAll("_", " ");
}

export default function HealthcarePage({
  resource,
}: {
  resource: HealthcareResource;
}) {
  const { t } = useTranslation();
  const tr = (text: string) => {
    const key = text
      .toLowerCase()
      .replace(/[^a-z0-9]+(.)/g, (_match, character: string) =>
        character.toUpperCase(),
      );
    return t(`healthcareAdmin.${key}`, { defaultValue: text });
  };
  const config = configs[resource];
  const data = useApiResource(
    useCallback(() => healthcareApi[resource].list(), [resource]),
  );
  const employees = useApiResource(
    useCallback(() => hrApi.employees.list(), []),
  );
  const departments = useApiResource(
    useCallback(() => healthcareApi.departments.list(), []),
  );
  const staff = useApiResource(
    useCallback(() => healthcareApi.staff.list(), []),
  );
  const [editing, setEditing] = useState<HealthcareRecord | null | undefined>();
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const rows = useMemo(
    () =>
      (data.data ?? []).filter((row) =>
        JSON.stringify(row).toLowerCase().includes(search.toLowerCase()),
      ),
    [data.data, search],
  );
  const options = (field: Field) =>
    field.type === "employee"
      ? employees.data?.map((employee) => [
          employee.id,
          `${employee.employeeCode} — ${employee.firstName} ${employee.lastName}`,
        ])
      : field.type === "department"
        ? departments.data?.map((department) => [
            department.id,
            String(department.name),
          ])
        : field.type === "doctor"
          ? staff.data
              ?.filter((member) => member.staffType === "doctor")
              .map((doctor) => [
                doctor.id,
                personName(nested(doctor, "employee")),
              ])
          : field.options?.map((value) => [value, value.replaceAll("_", " ")]);
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const payload: Record<string, unknown> = {};
    for (const field of config.fields) {
      const rawValue = String(form.get(field.name) ?? "");
      const raw = rawValue === "__none__" ? "" : rawValue;
      if (!raw && !field.required) {
        payload[field.name] = null;
        continue;
      }
      payload[field.name] =
        field.type === "number"
          ? Number(raw)
          : field.type === "boolean"
            ? raw === "true"
            : raw;
    }
    try {
      if (editing) await healthcareApi[resource].update(editing.id, payload);
      else await healthcareApi[resource].create(payload);
      setEditing(undefined);
      await Promise.all([
        data.refresh(),
        departments.refresh(),
        staff.refresh(),
        employees.refresh(),
      ]);
    } catch (cause) {
      setError(apiErrorMessage(cause));
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">{tr(config.title)}</h1>
        <p className="text-sm text-muted-foreground">
          {t(`healthcareAdmin.descriptions.${resource}`)}
        </p>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b p-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute inset-s-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="ps-9"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t("healthcareAdmin.search", {
                  entity: tr(config.title),
                })}
              />
            </div>
            <Button
              onClick={() => {
                setError("");
                setEditing(null);
              }}
            >
              <Plus className="size-4" />
              {t("healthcareAdmin.addRecord")}
            </Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {config.columns.map(([, label]) => (
                    <TableHead key={label}>{tr(label)}</TableHead>
                  ))}
                  <TableHead>{t("healthcareAdmin.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableResourceState
                  isLoading={data.isLoading}
                  error={data.error}
                  isEmpty={!rows.length}
                  colSpan={config.columns.length + 1}
                />
                {!data.isLoading &&
                  !data.error &&
                  rows.map((row) => (
                    <TableRow key={row.id}>
                      {config.columns.map(([key]) => (
                        <TableCell key={key}>
                          {key === "status" ||
                          key === "publicBookingEnabled" ? (
                            <Badge variant="secondary">
                              {tr(String(display(row, key)))}
                            </Badge>
                          ) : (
                            display(row, key)
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
                          description={t("healthcareAdmin.deleteConfirm")}
                          onConfirm={async () => {
                            try {
                              await healthcareApi[resource].remove(row.id);
                              await data.refresh();
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
      <Dialog
        open={editing !== undefined}
        onOpenChange={(open) => {
          if (!open && !busy) setEditing(undefined);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing
                ? t("healthcareAdmin.editRecord")
                : t("healthcareAdmin.addRecord")}{" "}
              · {tr(config.title)}
            </DialogTitle>
          </DialogHeader>
          <form className="grid gap-3 sm:grid-cols-2" onSubmit={submit}>
            {config.fields.map((field) => {
              const choices = options(field);
              const initial = editing?.[field.name];
              const initialValue =
                field.type === "datetime-local" && initial
                  ? new Date(String(initial)).toISOString().slice(0, 16)
                  : String(initial ?? "");
              return (
                <label
                  key={`${editing?.id ?? "new"}-${field.name}`}
                  className="space-y-1 text-xs font-medium"
                >
                  <span>{tr(field.label)}</span>
                  {choices ? (
                    <Select
                      name={field.name}
                      defaultValue={initialValue || "__none__"}
                      required={field.required}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("healthcareAdmin.selectField", {
                            field: tr(field.label),
                          })}
                        />
                      </SelectTrigger>
                      <SelectContent className="z-10000">
                        {!field.required && (
                          <SelectItem value="__none__">
                            {t("healthcareAdmin.none")}
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
                      initialValue={initialValue}
                      includeTime={field.type === "datetime-local"}
                      required={field.required}
                    />
                  ) : (
                    <Input
                      name={field.name}
                      type={field.type ?? "text"}
                      min={field.type === "number" ? 0 : undefined}
                      step={field.type === "number" ? 1 : undefined}
                      defaultValue={initialValue}
                      required={field.required}
                    />
                  )}
                </label>
              );
            })}
            {error && (
              <p className="text-sm text-destructive sm:col-span-2">{error}</p>
            )}
            <Button className="sm:col-span-2" disabled={busy}>
              {busy ? t("healthcareAdmin.saving") : t("healthcareAdmin.save")}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
