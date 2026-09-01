import { useCallback, useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CreditCard,
  Plus,
  Search,
  Stethoscope,
  Trash2,
  UserRound,
  UsersRound,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { crmApi, type CrmRecord, type CrmResource } from "../api/crm.api";
import { useApiResource } from "@/shared/hooks/useApiResource";
import { storedUser, hasPermission } from "@/features/auth/access";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
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
const configs: Record<
  CrmResource,
  { title: string; description: string; fields: Field[]; columns: string[] }
> = {
  leads: {
    title: "Leads",
    description: "Track prospective patients from first contact to conversion.",
    fields: [
      { name: "name", label: "Full name", required: true },
      { name: "phone", label: "Phone", required: true },
      { name: "email", label: "Email" },
      { name: "source", label: "Lead source" },
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
    columns: ["name", "phone", "interest", "source", "status"],
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
const pipelineSteps = [
  {
    path: "/crm/leads",
    label: "Lead",
    detail: "Qualify & convert",
    icon: UsersRound,
  },
  {
    path: "/crm/patients",
    label: "Patient",
    detail: "Patient profile",
    icon: UserRound,
  },
  {
    path: "/crm/appointments",
    label: "Doctor appointment",
    detail: "Consultation",
    icon: Stethoscope,
  },
  {
    path: "/crm/surgery-appointments",
    label: "Surgery appointment",
    detail: "Schedule procedure",
    icon: CalendarDays,
  },
  {
    path: "/crm/payments",
    label: "Surgery & payment",
    detail: "Complete journey",
    icon: CreditCard,
  },
];
export function CrmPipeline() {
  const { pathname } = useLocation();
  return (
    <section className="overflow-x-auto rounded-xl border bg-card px-4 py-3 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.14em] text-primary">
            Patient journey
          </p>
          <p className="text-[10px] text-muted-foreground">
            From first contact to completed treatment
          </p>
        </div>
      </div>
      <div className="flex min-w-[720px] items-start">
        {pipelineSteps.map(({ path, label, detail, icon: Icon }, index) => (
          <div key={path} className="flex flex-1 items-start">
            <Link
              to={path}
              className="group flex min-w-28 flex-col items-center text-center"
            >
              <span
                className={`grid size-9 place-items-center rounded-full border-2 transition-all ${pathname === path ? "border-primary bg-primary text-primary-foreground shadow-[0_0_0_4px_color-mix(in_srgb,var(--primary)_12%,transparent)]" : "border-border bg-muted/55 text-muted-foreground group-hover:border-primary/45 group-hover:text-primary"}`}
              >
                <Icon className="size-4" />
              </span>
              <span className="mt-2">
                <strong
                  className={`block text-[11px] ${pathname === path ? "text-primary" : "text-foreground"}`}
                >
                  {label}
                </strong>
                <small className="mt-0.5 block text-[8px] text-muted-foreground">
                  {detail}
                </small>
              </span>
            </Link>
            {index < pipelineSteps.length - 1 && (
              <span className="mt-4 h-px flex-1 bg-border">
                <ArrowRight className="ms-auto size-3 -translate-y-1.5 text-muted-foreground rtl:rotate-180" />
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
export default function CrmPage({ resource }: { resource: CrmResource }) {
  const config = configs[resource],
    user = storedUser(),
    canManage = hasPermission(user, "employees.manage");
  const [page, setPage] = useState(1);
  const data = useApiResource(
    useCallback(() => crmApi[resource].list(page), [resource, page]),
  );
  const lookups = useApiResource(useCallback(() => crmApi.lookups(), []));
  const [open, setOpen] = useState(false),
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
      await crmApi[resource].create(payload);
      setOpen(false);
      await Promise.all([data.refresh(), lookups.refresh()]);
      toast.success("Saved successfully.");
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
    return String(value ?? "—").replaceAll("_", " ");
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
  return (
    <div className="mx-auto max-w-[1500px] space-y-5">
      <CrmPipeline />
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">
            Healthcare CRM
          </p>
          <h1 className="mt-1 text-2xl font-bold">{config.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {config.description}
          </p>
        </div>
        {canManage && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus />
                Add record
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add {config.title.toLowerCase()}</DialogTitle>
              </DialogHeader>
              <form className="grid gap-4 sm:grid-cols-2" onSubmit={submit}>
                {config.fields.map((field) => (
                  <label
                    key={field.name}
                    className={`grid gap-1.5 text-sm font-medium ${field.type === "textarea" ? "sm:col-span-2" : ""}`}
                  >
                    {field.label}
                    {field.type === "select" ? (
                      <Select name={field.name} required={field.required}>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={`Select ${field.label.toLowerCase()}`}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options?.map((x) => (
                            <SelectItem key={x} value={x}>
                              {x.replaceAll("_", " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : field.type === "date" || field.type === "datetime" ? (
                      <FormDatePicker
                        name={field.name}
                        includeTime={field.type === "datetime"}
                        required={field.required}
                      />
                    ) : field.type &&
                      [
                        "patient",
                        "doctor",
                        "surgery",
                        "surgeryAppointment",
                      ].includes(field.type) ? (
                      <Select name={field.name} required={field.required}>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={`Select ${field.label.toLowerCase()}`}
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
                        className="min-h-24 rounded-md border bg-background p-3"
                      />
                    ) : (
                      <Input
                        name={field.name}
                        type={field.type === "number" ? "number" : "text"}
                        step={field.type === "number" ? "any" : undefined}
                        required={field.required}
                      />
                    )}
                  </label>
                ))}
                <Button className="sm:col-span-2" type="submit">
                  Save
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </header>
      <div className="relative max-w-md">
        <Search className="absolute start-3 top-2.5 size-4 text-muted-foreground" />
        <Input
          className="ps-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${config.title.toLowerCase()}…`}
        />
      </div>
      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              {config.columns.map((x) => (
                <TableHead key={x}>
                  {x
                    .replaceAll(/([A-Z])/g, " $1")
                    .replace(/^./, (c) => c.toUpperCase())}
                </TableHead>
              ))}
              {canManage && <TableHead />}
            </TableRow>
          </TableHeader>
          <TableBody autoPaginate={false} pagination={data.data ? { ...data.data.pagination, onPageChange: setPage, disabled: data.isLoading } : undefined}>
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
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
