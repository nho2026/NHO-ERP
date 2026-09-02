import { useCallback, useMemo, useState } from "react";
import {
  CalendarDays,
  LayoutGrid,
  List,
  ListFilter,
  MapPin,
  Pencil,
  Plus,
  Phone,
  Search,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { crmApi, type CrmRecord, type CrmResource } from "../api/crm.api";
import { useApiResource } from "@/shared/hooks/useApiResource";
import { storedUser, hasPermission } from "@/features/auth/access";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { PaginationControls } from "@/shared/components/ui/pagination-controls";
import { SurgeryAppointmentCalendar } from "../components/SurgeryAppointmentCalendar";
import { SearchableSelect } from "@/shared/components/ui/searchable-select";
import { DeleteConfirmationDialog } from "@/shared/components/ui/confirmation-dialog";
import { FormDatePicker } from "@/shared/components/ui/form-date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

type Field = {
  name: string;
  label: string;
  type?:
    | "select"
    | "date"
    | "datetime"
    | "number"
    | "textarea"
    | "patient"
    | "doctor"
    | "surgery"
    | "surgeryAppointment";
  options?: string[];
  required?: boolean;
};
type LeadFilters = {
  source: string;
  gender: string;
  status: string;
  minAge: string;
  maxAge: string;
};
const emptyLeadFilters: LeadFilters = {
  source: "",
  gender: "",
  status: "",
  minAge: "",
  maxAge: "",
};
type PatientFilters = {
  gender: string;
  bloodType: string;
  status: string;
  isMarried: string;
  hasDiabetes: string;
  hasHypertension: string;
};
const emptyPatientFilters: PatientFilters = {
  gender: "",
  bloodType: "",
  status: "",
  isMarried: "",
  hasDiabetes: "",
  hasHypertension: "",
};
function PatientFilterSelect({
  label,
  value,
  options,
  onChange,
  allLabel,
}: {
  label: string;
  value: string;
  options: Array<[string, string]>;
  onChange: (value: string) => void;
  allLabel: string;
}) {
  return (
    <label className="grid gap-1.5 text-xs font-medium">
      {label}
      <Select
        value={value || "all"}
        onValueChange={(next) => onChange(next === "all" ? "" : next)}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{allLabel}</SelectItem>
          {options.map(([optionValue, optionLabel]) => (
            <SelectItem key={optionValue} value={optionValue}>
              {optionLabel}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}
const configs: Record<
  CrmResource,
  { title: string; description: string; fields: Field[]; columns: string[] }
> = {
  leads: {
    title: "Leads",
    description: "Track prospective patients from first contact to conversion.",
    fields: [
      { name: "code", label: "Lead code", required: true },
      { name: "name", label: "Full name", required: true },
      { name: "phone", label: "Phone", required: true },
      { name: "source", label: "Lead source", required: true },
      { name: "age", label: "Age", type: "number" },
      {
        name: "gender",
        label: "Gender",
        type: "select",
        options: ["male", "female", "other"],
      },
      { name: "address", label: "Address" },
      { name: "email", label: "Email" },
      { name: "interest", label: "Interested service" },
      { name: "notes", label: "Notes", type: "textarea" },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: ["new", "contacted", "qualified", "converted", "lost"],
        required: true,
      },
    ],
    columns: [
      "code",
      "name",
      "phone",
      "source",
      "age",
      "gender",
      "address",
      "status",
    ],
  },
  patients: {
    title: "Patients",
    description: "Central patient records and medical contact information.",
    fields: [
      { name: "patientCode", label: "Patient code", required: true },
      { name: "firstName", label: "First name", required: true },
      { name: "lastName", label: "Last name", required: true },
      { name: "phone", label: "Phone", required: true },
      { name: "email", label: "Email" },
      { name: "dateOfBirth", label: "Date of birth", type: "date" },
      {
        name: "gender",
        label: "Gender",
        type: "select",
        options: ["male", "female", "other"],
      },
      {
        name: "bloodType",
        label: "Blood type",
        type: "select",
        options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      },
      { name: "address", label: "Address" },
      { name: "allergies", label: "Allergies", type: "textarea" },
      { name: "medicalNotes", label: "Medical notes", type: "textarea" },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: ["active", "inactive"],
        required: true,
      },
    ],
    columns: ["patientCode", "name", "phone", "bloodType", "status"],
  },
  surgeries: {
    title: "Surgeries",
    description: "Maintain the surgery and procedure catalog.",
    fields: [
      { name: "code", label: "Code", required: true },
      { name: "name", label: "Surgery name", required: true },
      { name: "description", label: "Description", type: "textarea" },
      {
        name: "durationMinutes",
        label: "Duration (minutes)",
        type: "number",
        required: true,
      },
      {
        name: "basePrice",
        label: "Base price",
        type: "number",
        required: true,
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: ["active", "inactive"],
        required: true,
      },
    ],
    columns: ["code", "name", "durationMinutes", "basePrice", "status"],
  },
  "surgery-appointments": {
    title: "Surgery appointments",
    description:
      "Schedule procedures with patients, surgeons, and operating rooms.",
    fields: [
      { name: "patientId", label: "Patient", type: "patient", required: true },
      { name: "doctorId", label: "Doctor", type: "doctor", required: true },
      { name: "surgeryId", label: "Surgery", type: "surgery", required: true },
      {
        name: "scheduledAt",
        label: "Date and time",
        type: "datetime",
        required: true,
      },
      { name: "operatingRoom", label: "Operating room" },
      { name: "preOpNotes", label: "Pre-operation notes", type: "textarea" },
      { name: "postOpNotes", label: "Post-operation notes", type: "textarea" },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: [
          "scheduled",
          "confirmed",
          "in_progress",
          "completed",
          "cancelled",
        ],
        required: true,
      },
    ],
    columns: [
      "patient",
      "surgery",
      "doctor",
      "scheduledAt",
      "operatingRoom",
      "status",
    ],
  },
  payments: {
    title: "Payments",
    description: "Record patient payments for appointments and surgeries.",
    fields: [
      { name: "patientId", label: "Patient", type: "patient", required: true },
      {
        name: "surgeryAppointmentId",
        label: "Surgery appointment",
        type: "surgeryAppointment",
      },
      { name: "amount", label: "Amount", type: "number", required: true },
      {
        name: "paymentMethod",
        label: "Payment method",
        type: "select",
        options: ["cash", "card", "bank_transfer", "insurance"],
        required: true,
      },
      { name: "reference", label: "Reference" },
      {
        name: "paidAt",
        label: "Payment date and time",
        type: "datetime",
        required: true,
      },
      { name: "notes", label: "Notes", type: "textarea" },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: ["paid", "pending", "refunded", "cancelled"],
        required: true,
      },
    ],
    columns: ["patient", "amount", "paymentMethod", "paidAt", "status"],
  },
};
const labelOf = (x: CrmRecord, type?: Field["type"]): string =>
  type === "doctor"
    ? `${(x.employee as CrmRecord)?.firstName ?? ""} ${(x.employee as CrmRecord)?.lastName ?? ""}`
    : type === "surgeryAppointment"
      ? `${labelOf(x.patient as CrmRecord)} — ${String((x.surgery as CrmRecord)?.name ?? "")}`
      : String(
          x.name ?? `${x.firstName ?? ""} ${x.lastName ?? ""}`.trim() ?? x.code,
        );
const statusStyles: Record<string, string> = {
  new: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-300",
  contacted:
    "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300",
  qualified:
    "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-950/60 dark:text-violet-300",
  converted:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
  active:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
  paid: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
  completed:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
  scheduled:
    "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-300",
  confirmed:
    "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300",
  pending:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
  in_progress:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
  refunded:
    "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-950/60 dark:text-violet-300",
  inactive:
    "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300",
  lost: "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/60 dark:text-red-300",
  cancelled:
    "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/60 dark:text-red-300",
};
const statusClass = (status: unknown) =>
  statusStyles[String(status)] ??
  "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300";
const patientAge = (dateOfBirth: unknown) => {
  if (!dateOfBirth) return "—";
  const birth = new Date(String(dateOfBirth));
  if (Number.isNaN(birth.getTime())) return "—";
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  if (
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
  )
    age -= 1;
  return String(age);
};
export default function CrmPage({ resource }: { resource: CrmResource }) {
  const { t } = useTranslation();
  const config = configs[resource],
    user = storedUser(),
    canManage = hasPermission(user, "employees.manage");
  const [page, setPage] = useState(1);
  const [leadFilters, setLeadFilters] = useState<LeadFilters>(emptyLeadFilters);
  const [draftFilters, setDraftFilters] =
    useState<LeadFilters>(emptyLeadFilters);
  const [patientFilters, setPatientFilters] =
    useState<PatientFilters>(emptyPatientFilters);
  const [draftPatientFilters, setDraftPatientFilters] =
    useState<PatientFilters>(emptyPatientFilters);
  const [filterOpen, setFilterOpen] = useState(false);
  const [patientView, setPatientView] = useState<"grid" | "table">("grid");
  const [surgeryView, setSurgeryView] = useState<"calendar" | "table">(
    "calendar",
  );
  const [surgeryDraftAt, setSurgeryDraftAt] = useState("");
  const data = useApiResource(
    useCallback(
      () =>
        crmApi[resource].list(
          page,
          50,
          resource === "leads"
            ? Object.fromEntries(
                Object.entries(leadFilters).filter(([, value]) => value),
              )
            : resource === "patients"
              ? Object.fromEntries(
                  Object.entries(patientFilters).filter(([, value]) => value),
                )
              : {},
        ),
      [resource, page, leadFilters, patientFilters],
    ),
  );
  const lookups = useApiResource(useCallback(() => crmApi.lookups(), []));
  const [open, setOpen] = useState(false),
    [editingRecord, setEditingRecord] = useState<CrmRecord | null>(null),
    [search, setSearch] = useState("");
  const rows = useMemo(
    () =>
      (data.data?.items ?? []).filter((x) =>
        JSON.stringify(x).toLowerCase().includes(search.toLowerCase()),
      ),
    [data.data?.items, search],
  );
  const choices = (field: Field): CrmRecord[] =>
    field.type === "patient"
      ? (lookups.data?.patients ?? [])
      : field.type === "doctor"
        ? (lookups.data?.doctors ?? [])
        : field.type === "surgery"
          ? (lookups.data?.surgeries ?? [])
          : field.type === "surgeryAppointment"
            ? (lookups.data?.surgeryAppointments ?? [])
            : [];
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget),
      payload: Record<string, unknown> = {};
    for (const field of config.fields) {
      const raw = String(form.get(field.name) ?? "");
      payload[field.name] = raw || null;
      if (field.type === "number" && raw) payload[field.name] = Number(raw);
    }
    try {
      if (editingRecord) {
        await crmApi[resource].update(editingRecord.id, payload);
      } else {
        await crmApi[resource].create(payload);
      }
      setOpen(false);
      setEditingRecord(null);
      await Promise.all([data.refresh(), lookups.refresh()]);
      toast.success(
        editingRecord ? "Record updated successfully." : "Saved successfully.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save record.",
      );
    }
  };
  const show = (row: CrmRecord, key: string) => {
    if (key === "name" && resource === "patients")
      return `${row.firstName} ${row.lastName}`;
    if (["patient", "doctor", "surgery"].includes(key))
      return labelOf(row[key] as CrmRecord, key as Field["type"]);
    const value = row[key];
    if (key.endsWith("At") && value)
      return new Date(String(value)).toLocaleString();
    const display = String(value ?? "—").replaceAll("_", " ");
    return typeof value === "string"
      ? t(`crm.values.${value}`, { defaultValue: display })
      : display;
  };
  const updateLeadStatus = async (row: CrmRecord, status: string) => {
    try {
      await crmApi.leads.update(row.id, { status });
      await Promise.all([data.refresh(), lookups.refresh()]);
      toast.success(
        status === "converted"
          ? "Lead converted and patient profile created."
          : "Lead status updated.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to update lead.",
      );
    }
  };
  const activeFilterCount = Object.values(leadFilters).filter(Boolean).length;
  const applyLeadFilters = () => {
    if (
      draftFilters.minAge &&
      draftFilters.maxAge &&
      Number(draftFilters.minAge) > Number(draftFilters.maxAge)
    ) {
      toast.error("Minimum age cannot be greater than maximum age.");
      return;
    }
    setPage(1);
    setLeadFilters(draftFilters);
    setFilterOpen(false);
  };
  const clearLeadFilters = () => {
    setPage(1);
    setDraftFilters(emptyLeadFilters);
    setLeadFilters(emptyLeadFilters);
    setFilterOpen(false);
  };
  const activePatientFilterCount =
    Object.values(patientFilters).filter(Boolean).length;
  const applyPatientFilters = () => {
    setPage(1);
    setPatientFilters(draftPatientFilters);
    setFilterOpen(false);
  };
  const clearPatientFilters = () => {
    setPage(1);
    setDraftPatientFilters(emptyPatientFilters);
    setPatientFilters(emptyPatientFilters);
    setFilterOpen(false);
  };
  return (
    <div className="mx-auto max-w-[1500px] space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">
            {t("crm.eyebrow")}
          </p>
          <h1 className="mt-1 text-2xl font-bold">
            {t(`crm.resources.${resource}.title`, {
              defaultValue: config.title,
            })}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t(`crm.resources.${resource}.description`, {
              defaultValue: config.description,
            })}
          </p>
        </div>
        {canManage && (
          <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
              setOpen(nextOpen);
              if (!nextOpen) setEditingRecord(null);
            }}
          >
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingRecord(null);
                  setSurgeryDraftAt("");
                }}
              >
                <Plus />
                {t("crm.actions.addRecord")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingRecord
                    ? t("crm.actions.editRecord")
                    : t("crm.actions.addRecord")}
                </DialogTitle>
              </DialogHeader>
              <form
                key={editingRecord?.id ?? surgeryDraftAt ?? "create"}
                className="grid gap-4 sm:grid-cols-2"
                onSubmit={submit}
              >
                {config.fields.map((field) => (
                  <label
                    key={field.name}
                    className={`grid gap-1.5 text-sm font-medium ${field.type === "textarea" ? "sm:col-span-2" : ""}`}
                  >
                    {t(`crm.fields.${field.name}`, {
                      defaultValue: field.label,
                    })}
                    {field.type === "select" ? (
                      <Select
                        name={field.name}
                        required={field.required}
                        defaultValue={String(editingRecord?.[field.name] ?? "")}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("crm.placeholders.selectField", {
                              field: t(`crm.fields.${field.name}`, {
                                defaultValue: field.label,
                              }),
                            })}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options?.map((x) => (
                            <SelectItem key={x} value={x}>
                              {t(`crm.values.${x}`, {
                                defaultValue: x.replaceAll("_", " "),
                              })}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : field.type === "date" || field.type === "datetime" ? (
                      <FormDatePicker
                        name={field.name}
                        initialValue={String(
                          editingRecord?.[field.name] ??
                            (field.name === "scheduledAt"
                              ? surgeryDraftAt
                              : ""),
                        )}
                        includeTime={field.type === "datetime"}
                        required={field.required}
                      />
                    ) : field.type === "patient" ? (
                      <SearchableSelect
                        name={field.name}
                        required={field.required}
                        defaultValue={String(editingRecord?.[field.name] ?? "")}
                        placeholder={t("crm.actions.selectPatient")}
                        searchPlaceholder={t("crm.actions.searchPatients")}
                        options={choices(field).map((patient) => ({
                          value: patient.id,
                          label: labelOf(patient, field.type),
                          searchText: String(patient.patientCode ?? ""),
                        }))}
                      />
                    ) : field.type &&
                      [
                        "patient",
                        "doctor",
                        "surgery",
                        "surgeryAppointment",
                      ].includes(field.type) ? (
                      <Select
                        name={field.name}
                        required={field.required}
                        defaultValue={String(editingRecord?.[field.name] ?? "")}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t("crm.placeholders.selectField", {
                              field: t(`crm.fields.${field.name}`, {
                                defaultValue: field.label,
                              }),
                            })}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {choices(field).map((x) => (
                            <SelectItem key={x.id} value={x.id}>
                              {labelOf(x, field.type)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : field.type === "textarea" ? (
                      <textarea
                        name={field.name}
                        defaultValue={String(editingRecord?.[field.name] ?? "")}
                        className="min-h-24 rounded-md border bg-background p-3"
                      />
                    ) : (
                      <Input
                        name={field.name}
                        type={field.type === "number" ? "number" : "text"}
                        step={field.type === "number" ? "any" : undefined}
                        defaultValue={String(editingRecord?.[field.name] ?? "")}
                        required={field.required}
                      />
                    )}
                  </label>
                ))}
                <Button className="sm:col-span-2" type="submit">
                  {editingRecord ? "Save changes" : "Save"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </header>
      <div className="flex max-w-2xl flex-wrap items-center gap-2">
        <div className="relative min-w-64 flex-1">
          <Search className="absolute start-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            className="ps-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("crm.actions.searchRecords")}
          />
        </div>
        {resource === "leads" && (
          <Popover open={filterOpen} onOpenChange={setFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="relative">
                <ListFilter />
                {t("crm.actions.filterLeads")}
                {activeFilterCount > 0 && (
                  <Badge className="ms-1 h-5 min-w-5 justify-center rounded-full px-1.5">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-4">
              <div className="mb-4">
                <p className="font-semibold">{t("crm.actions.filterLeads")}</p>
                <p className="text-xs text-muted-foreground">
                  Narrow results across every page.
                </p>
              </div>
              <div className="grid gap-3">
                <label className="grid gap-1.5 text-xs font-medium">
                  Source
                  <Input
                    value={draftFilters.source}
                    onChange={(event) =>
                      setDraftFilters((current) => ({
                        ...current,
                        source: event.target.value,
                      }))
                    }
                    placeholder={t("crm.placeholders.leadSource")}
                  />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="grid gap-1.5 text-xs font-medium">
                    Gender
                    <Select
                      value={draftFilters.gender || "all"}
                      onValueChange={(gender) =>
                        setDraftFilters((current) => ({
                          ...current,
                          gender: gender === "all" ? "" : gender,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </label>
                  <label className="grid gap-1.5 text-xs font-medium">
                    Status
                    <Select
                      value={draftFilters.status || "all"}
                      onValueChange={(status) =>
                        setDraftFilters((current) => ({
                          ...current,
                          status: status === "all" ? "" : status,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {[
                          "new",
                          "contacted",
                          "qualified",
                          "converted",
                          "lost",
                        ].map((status) => (
                          <SelectItem key={status} value={status}>
                            {status.replaceAll("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <label className="grid gap-1.5 text-xs font-medium">
                    Minimum age
                    <Input
                      type="number"
                      min={0}
                      max={150}
                      value={draftFilters.minAge}
                      onChange={(event) =>
                        setDraftFilters((current) => ({
                          ...current,
                          minAge: event.target.value,
                        }))
                      }
                    />
                  </label>
                  <label className="grid gap-1.5 text-xs font-medium">
                    Maximum age
                    <Input
                      type="number"
                      min={0}
                      max={150}
                      value={draftFilters.maxAge}
                      onChange={(event) =>
                        setDraftFilters((current) => ({
                          ...current,
                          maxAge: event.target.value,
                        }))
                      }
                    />
                  </label>
                </div>
                <div className="mt-1 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={clearLeadFilters}
                  >
                    {t("crm.actions.clear")}
                  </Button>
                  <Button type="button" onClick={applyLeadFilters}>
                    {t("crm.actions.applyFilters")}
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
        {resource === "patients" && (
          <Popover open={filterOpen} onOpenChange={setFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <ListFilter /> {t("crm.actions.filterPatients")}
                {activePatientFilterCount > 0 && (
                  <Badge className="ms-1 h-5 min-w-5 justify-center rounded-full px-1.5">
                    {activePatientFilterCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-96 p-4">
              <div className="mb-4">
                <p className="font-semibold">
                  {t("crm.actions.filterPatients")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("crm.filterPatientsDescription")}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <PatientFilterSelect
                  allLabel={t("crm.values.all")}
                  label="Gender"
                  value={draftPatientFilters.gender}
                  options={[
                    ["male", "Male"],
                    ["female", "Female"],
                    ["other", "Other"],
                  ]}
                  onChange={(gender) =>
                    setDraftPatientFilters((current) => ({
                      ...current,
                      gender,
                    }))
                  }
                />
                <PatientFilterSelect
                  allLabel={t("crm.values.all")}
                  label="Blood type"
                  value={draftPatientFilters.bloodType}
                  options={[
                    "A+",
                    "A-",
                    "B+",
                    "B-",
                    "AB+",
                    "AB-",
                    "O+",
                    "O-",
                  ].map((value) => [value, value])}
                  onChange={(bloodType) =>
                    setDraftPatientFilters((current) => ({
                      ...current,
                      bloodType,
                    }))
                  }
                />
                <PatientFilterSelect
                  allLabel={t("crm.values.all")}
                  label="Status"
                  value={draftPatientFilters.status}
                  options={[
                    ["active", "Active"],
                    ["inactive", "Inactive"],
                  ]}
                  onChange={(status) =>
                    setDraftPatientFilters((current) => ({
                      ...current,
                      status,
                    }))
                  }
                />
                <PatientFilterSelect
                  allLabel={t("crm.values.all")}
                  label="Marital status"
                  value={draftPatientFilters.isMarried}
                  options={[
                    ["true", "Married"],
                    ["false", "Not married"],
                  ]}
                  onChange={(isMarried) =>
                    setDraftPatientFilters((current) => ({
                      ...current,
                      isMarried,
                    }))
                  }
                />
                <PatientFilterSelect
                  allLabel={t("crm.values.all")}
                  label="Diabetes"
                  value={draftPatientFilters.hasDiabetes}
                  options={[
                    ["true", "Has diabetes"],
                    ["false", "No diabetes"],
                  ]}
                  onChange={(hasDiabetes) =>
                    setDraftPatientFilters((current) => ({
                      ...current,
                      hasDiabetes,
                    }))
                  }
                />
                <PatientFilterSelect
                  allLabel={t("crm.values.all")}
                  label="Blood pressure"
                  value={draftPatientFilters.hasHypertension}
                  options={[
                    ["true", "Has high pressure"],
                    ["false", "No high pressure"],
                  ]}
                  onChange={(hasHypertension) =>
                    setDraftPatientFilters((current) => ({
                      ...current,
                      hasHypertension,
                    }))
                  }
                />
              </div>
              <div className="mt-4 flex justify-end gap-2 border-t pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={clearPatientFilters}
                >
                  {t("crm.actions.clear")}
                </Button>
                <Button type="button" onClick={applyPatientFilters}>
                  {t("crm.actions.applyFilters")}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}
        {resource === "patients" && (
          <div className="flex rounded-lg border p-1">
            <Button
              type="button"
              size="sm"
              variant={patientView === "grid" ? "default" : "ghost"}
              onClick={() => setPatientView("grid")}
            >
              <LayoutGrid /> {t("crm.actions.grid")}
            </Button>
            <Button
              type="button"
              size="sm"
              variant={patientView === "table" ? "default" : "ghost"}
              onClick={() => setPatientView("table")}
            >
              <List /> {t("crm.actions.table")}
            </Button>
          </div>
        )}
        {resource === "surgery-appointments" && (
          <div className="flex rounded-lg border p-1">
            <Button
              type="button"
              size="sm"
              variant={surgeryView === "calendar" ? "default" : "ghost"}
              onClick={() => setSurgeryView("calendar")}
            >
              <CalendarDays /> {t("crm.actions.calendar")}
            </Button>
            <Button
              type="button"
              size="sm"
              variant={surgeryView === "table" ? "default" : "ghost"}
              onClick={() => setSurgeryView("table")}
            >
              <List /> {t("crm.actions.table")}
            </Button>
          </div>
        )}
      </div>
      {resource === "surgery-appointments" && surgeryView === "calendar" ? (
        <SurgeryAppointmentCalendar
          appointments={rows}
          onCreate={(day) => {
            const year = day.getFullYear();
            const month = String(day.getMonth() + 1).padStart(2, "0");
            const date = String(day.getDate()).padStart(2, "0");
            setEditingRecord(null);
            setSurgeryDraftAt(`${year}-${month}-${date}T09:00`);
            setOpen(true);
          }}
          onEdit={(appointment) => {
            setSurgeryDraftAt("");
            setEditingRecord(appointment);
            setOpen(true);
          }}
        />
      ) : resource === "patients" && patientView === "grid" ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {rows.map((patient) => (
              <Card
                key={patient.id}
                className="group overflow-hidden transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
              >
                <Link
                  to={`/crm/patients/${patient.id}`}
                  className="block h-full"
                >
                  <div className="bg-gradient-to-br from-primary/10 via-cyan-500/5 to-transparent p-4 pb-3">
                    <div className="flex items-start gap-3">
                      <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-primary/15 bg-background text-sm font-bold text-primary shadow-sm transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        {String(patient.firstName ?? "P").charAt(0)}
                        {String(patient.lastName ?? "").charAt(0)}
                      </span>
                      <div className="min-w-0 flex-1 pt-0.5">
                        <h2 className="truncate font-bold group-hover:text-primary">
                          {String(patient.firstName)} {String(patient.lastName)}
                        </h2>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          {String(patient.patientCode)}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`shrink-0 capitalize ${statusClass(patient.status)}`}
                      >
                        {String(patient.status)}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4 pt-3">
                    <div className="grid grid-cols-3 divide-x rounded-xl border bg-muted/20 py-2.5 rtl:divide-x-reverse">
                      <div className="text-center">
                        <p className="text-[9px] uppercase tracking-wide text-muted-foreground">
                          Age
                        </p>
                        <p className="mt-0.5 text-sm font-bold">
                          {patientAge(patient.dateOfBirth)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-[9px] uppercase tracking-wide text-muted-foreground">
                          Blood
                        </p>
                        <p className="mt-0.5 text-sm font-bold text-red-600">
                          {String(patient.bloodType ?? "—")}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-[9px] uppercase tracking-wide text-muted-foreground">
                          Visits
                        </p>
                        <p className="mt-0.5 text-sm font-bold">
                          {String(
                            (
                              patient._count as
                                Record<string, unknown> | undefined
                            )?.surgeryAppointments ?? 0,
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 grid gap-2 text-xs">
                      <span className="flex items-center gap-2 truncate">
                        <Phone className="size-3.5 shrink-0 text-primary" />
                        {String(patient.phone)}
                      </span>
                      <span className="flex items-center gap-2 truncate">
                        <MapPin className="size-3.5 shrink-0 text-primary" />
                        {String(patient.address ?? "Address not recorded")}
                      </span>
                    </div>
                    <div className="mt-3 flex min-h-6 flex-wrap gap-1.5">
                      <Badge
                        variant="secondary"
                        className="h-5 capitalize text-[10px]"
                      >
                        {String(patient.gender ?? "Unknown")}
                      </Badge>
                      {Boolean(patient.hasDiabetes) && (
                        <Badge className="h-5 bg-amber-100 text-[10px] text-amber-700 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-300">
                          Diabetes
                        </Badge>
                      )}
                      {Boolean(patient.hasHypertension) && (
                        <Badge className="h-5 bg-red-100 text-[10px] text-red-700 hover:bg-red-100 dark:bg-red-950 dark:text-red-300">
                          High pressure
                        </Badge>
                      )}
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t pt-3 text-[11px]">
                      <span className="text-muted-foreground">
                        {String(
                          (
                            patient._count as
                              Record<string, unknown> | undefined
                          )?.formSubmissions ?? 0,
                        )}{" "}
                        clinical forms
                      </span>
                      <span className="font-semibold text-primary">
                        View profile →
                      </span>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
          {data.data && (
            <div className="overflow-hidden rounded-xl border bg-card">
              <PaginationControls
                page={data.data.pagination.page}
                totalPages={data.data.pagination.totalPages}
                total={data.data.pagination.total}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                {config.columns.map((x) => (
                  <TableHead key={x}>
                    {t(`crm.fields.${x}`, {
                      defaultValue: x
                        .replaceAll(/([A-Z])/g, " $1")
                        .replace(/^./, (c) => c.toUpperCase()),
                    })}
                  </TableHead>
                ))}
                {canManage && <TableHead />}
              </TableRow>
            </TableHeader>
            <TableBody
              autoPaginate={false}
              pagination={
                data.data
                  ? {
                      ...data.data.pagination,
                      onPageChange: setPage,
                      disabled: data.isLoading,
                    }
                  : undefined
              }
            >
              {rows.map((row) => (
                <TableRow key={row.id}>
                  {config.columns.map((key) => (
                    <TableCell key={key}>
                      {key === "status" && resource === "leads" && canManage ? (
                        <div className="flex w-44 items-center gap-2">
                          <Select
                            value={String(row.status)}
                            onValueChange={(status) =>
                              void updateLeadStatus(row, status)
                            }
                          >
                            <SelectTrigger
                              className={`h-8 capitalize font-semibold ${statusClass(row.status)}`}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[
                                "new",
                                "contacted",
                                "qualified",
                                "converted",
                                "lost",
                              ].map((status) => (
                                <SelectItem key={status} value={status}>
                                  {status}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {Boolean(row.convertedPatient) && (
                            <span
                              className="size-2 shrink-0 rounded-full bg-emerald-500"
                              title="Patient created"
                            />
                          )}
                        </div>
                      ) : key === "name" && resource === "patients" ? (
                        <Link
                          to={`/crm/patients/${row.id}`}
                          className="font-semibold text-primary hover:underline"
                        >
                          {show(row, key)}
                        </Link>
                      ) : key === "status" ? (
                        <Badge
                          variant="outline"
                          className={`capitalize ${statusClass(row.status)}`}
                        >
                          {show(row, key)}
                        </Badge>
                      ) : (
                        show(row, key)
                      )}
                    </TableCell>
                  ))}
                  {canManage && (
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        {resource === "leads" && (
                          <Button
                            size="icon"
                            variant="ghost"
                            title="Edit lead"
                            onClick={() => {
                              setEditingRecord(row);
                              setOpen(true);
                            }}
                          >
                            <Pencil className="size-4" />
                          </Button>
                        )}
                        <DeleteConfirmationDialog
                          description="This permanently deletes this CRM record. This action cannot be undone."
                          onConfirm={async () => {
                            try {
                              await crmApi[resource].remove(row.id);
                              await Promise.all([
                                data.refresh(),
                                lookups.refresh(),
                              ]);
                            } catch (error) {
                              toast.error(
                                error instanceof Error
                                  ? error.message
                                  : "Unable to delete record.",
                              );
                            }
                          }}
                        >
                          <Button size="icon" variant="ghost">
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        </DeleteConfirmationDialog>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
