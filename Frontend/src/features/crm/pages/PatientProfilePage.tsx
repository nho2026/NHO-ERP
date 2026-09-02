import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Droplets,
  FileText,
  HeartPulse,
  MapPin,
  Pencil,
  Phone,
  Stethoscope,
  UserRound,
  UsersRound,
  ClipboardPlus,
} from "lucide-react";
import { toast } from "sonner";
import {
  crmApi,
  crmFormsApi,
  type CrmRecord,
  type FormTemplate,
} from "../api/crm.api";
import { hasPermission, storedUser } from "@/features/auth/access";
import { useApiResource } from "@/shared/hooks/useApiResource";
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
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { FormDatePicker } from "@/shared/components/ui/form-date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

const text = (value: unknown, fallback = "Not recorded") =>
  value == null || value === "" ? fallback : String(value);
const fullName = (patient: CrmRecord) =>
  `${text(patient.firstName, "")} ${text(patient.lastName, "")}`.trim();
const doctorName = (visit: CrmRecord) => {
  const employee = (visit.doctor as CrmRecord | undefined)?.employee as
    CrmRecord | undefined;
  return employee
    ? `${text(employee.firstName, "")} ${text(employee.lastName, "")}`.trim()
    : "Doctor not assigned";
};

export default function PatientProfilePage() {
  const { t } = useTranslation();
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const canManage = hasPermission(storedUser(), "employees.manage");
  const profile = useApiResource(
    useCallback(() => crmApi.patients.get(id), [id]),
  );
  const templates = useApiResource(
    useCallback(() => crmFormsApi.activeTemplates(), []),
  );
  const submissions = useApiResource(
    useCallback(() => crmFormsApi.submissions(id), [id]),
  );
  const [editing, setEditing] = useState(false);
  const [isMarried, setIsMarried] = useState(false);
  const [hasDiabetes, setHasDiabetes] = useState(false);
  const [hasHypertension, setHasHypertension] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(
    null,
  );
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});
  const patient = profile.data;
  const lead = patient?.lead as CrmRecord | null | undefined;
  const appointments = (patient?.appointments ?? []) as CrmRecord[];
  const surgeries = (patient?.surgeryAppointments ?? []) as CrmRecord[];
  const age = useMemo(() => {
    if (patient?.dateOfBirth) {
      const birth = new Date(String(patient.dateOfBirth));
      const now = new Date();
      return (
        now.getFullYear() -
        birth.getFullYear() -
        (now < new Date(now.getFullYear(), birth.getMonth(), birth.getDate())
          ? 1
          : 0)
      );
    }
    return lead?.age ?? null;
  }, [patient?.dateOfBirth, lead?.age]);
  const visits = useMemo<Array<CrmRecord & { kind: string }>>(
    () =>
      [
        ...appointments.map((visit) => ({ ...visit, kind: "Consultation" })),
        ...surgeries.map((visit) => ({ ...visit, kind: "Surgery" })),
      ]
        .sort(
          (a, b) =>
            new Date(String((b as CrmRecord).scheduledAt)).getTime() -
            new Date(String((a as CrmRecord).scheduledAt)).getTime(),
        )
        .slice(0, 6),
    [appointments, surgeries],
  );

  if (profile.isLoading || !patient)
    return (
      <div className="p-10 text-center text-muted-foreground">
        Loading patient profile…
      </div>
    );

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload: Record<string, unknown> = Object.fromEntries(
      [
        "firstName",
        "lastName",
        "phone",
        "email",
        "gender",
        "bloodType",
        "address",
        "allergies",
        "medicalNotes",
        "weightKg",
        "heightCm",
      ].map((key) => [key, String(form.get(key) ?? "") || null]),
    );
    payload.weightKg = payload.weightKg ? Number(payload.weightKg) : null;
    payload.heightCm = payload.heightCm ? Number(payload.heightCm) : null;
    payload.isMarried = isMarried;
    payload.childrenCount = payload.isMarried
      ? Number(form.get("childrenCount") ?? 0)
      : 0;
    payload.hasDiabetes = hasDiabetes;
    payload.hasHypertension = hasHypertension;
    try {
      await crmApi.patients.update(id, payload);
      setEditing(false);
      await profile.refresh();
      toast.success("Patient profile updated.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to update patient.",
      );
    }
  };
  const submitClinicalForm = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (!selectedTemplate) return;
    try {
      await crmFormsApi.submit(id, {
        formTemplateId: selectedTemplate.id,
        data: formValues,
      });
      setFormOpen(false);
      setSelectedTemplate(null);
      setFormValues({});
      await submissions.refresh();
      toast.success("Patient form submitted.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to submit form.",
      );
    }
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-5">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-800 text-white shadow-xl">
        <div className="flex flex-wrap items-start justify-between gap-6 p-6 md:p-8">
          <div className="flex items-center gap-4">
            <Button
              size="icon"
              variant="ghost"
              className="text-white hover:bg-white/10 hover:text-white"
              onClick={() => navigate("/crm/patients")}
            >
              <ArrowLeft className="rtl:rotate-180" />
            </Button>
            <div className="grid size-16 place-items-center rounded-2xl border border-white/20 bg-white/10 text-xl font-bold backdrop-blur">
              {text(patient.firstName, "P").charAt(0)}
              {text(patient.lastName, "").charAt(0)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold">{fullName(patient)}</h1>
                <Badge className="border-emerald-300/30 bg-emerald-400/20 text-emerald-100">
                  {text(patient.status, "active")}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-blue-100">
                {text(patient.patientCode)}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-white/10 px-3 py-1.5">
                  Age: {text(age)}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1.5 capitalize">
                  Gender: {text(patient.gender)}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1.5">
                  Blood: {text(patient.bloodType)}
                </span>
              </div>
            </div>
          </div>
          {canManage && (
            <Button
              variant="secondary"
              onClick={() => {
                setIsMarried(Boolean(patient.isMarried));
                setHasDiabetes(Boolean(patient.hasDiabetes));
                setHasHypertension(Boolean(patient.hasHypertension));
                setEditing(true);
              }}
            >
              <Pencil /> Edit profile
            </Button>
          )}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total visits",
            value: text(patient.visitCount, "0"),
            icon: CalendarDays,
            color: "text-violet-600 bg-violet-100 dark:bg-violet-950",
          },
          {
            label: "Lead source",
            value: text(lead?.source),
            icon: UsersRound,
            color: "text-blue-600 bg-blue-100 dark:bg-blue-950",
          },
          {
            label: "Phone",
            value: text(patient.phone),
            icon: Phone,
            color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-950",
          },
          {
            label: "Location",
            value: text(patient.address),
            icon: MapPin,
            color: "text-amber-600 bg-amber-100 dark:bg-amber-950",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="flex items-center gap-3 p-5">
              <span
                className={`grid size-11 place-items-center rounded-xl ${color}`}
              >
                <Icon className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="truncate font-semibold">{value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card>
        <CardContent className="p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <FileText />
              </span>
              <div>
                <h2 className="font-bold">Clinical forms & examinations</h2>
                <p className="text-xs text-muted-foreground">
                  Submitted assessments remain part of this patient profile.
                </p>
              </div>
            </div>
            {canManage && (
              <Button
                onClick={() => setFormOpen(true)}
                disabled={!templates.data?.length}
              >
                <ClipboardPlus />
                Submit form
              </Button>
            )}
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {submissions.data?.length ? (
              submissions.data.map((submission) => {
                const template = submission.formTemplate as FormTemplate;
                const values = submission.data as Record<string, unknown>;
                return (
                  <details
                    key={submission.id}
                    className="group rounded-xl border bg-muted/15 p-4"
                  >
                    <summary className="cursor-pointer list-none">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold">{template.name}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {new Date(
                              String(submission.createdAt),
                            ).toLocaleString()}
                          </p>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {template.category}
                        </Badge>
                      </div>
                    </summary>
                    <dl className="mt-4 grid gap-2 border-t pt-3 text-sm">
                      {template.fields.map((field) => (
                        <div
                          key={field.id}
                          className="grid grid-cols-[1fr_1.2fr] gap-3"
                        >
                          <dt className="text-muted-foreground">
                            {field.label}
                          </dt>
                          <dd className="font-medium">
                            {field.type === "checkbox"
                              ? values[field.id]
                                ? "Yes"
                                : "No"
                              : text(values[field.id], "—")}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </details>
                );
              })
            ) : (
              <p className="col-span-full rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                No clinical forms submitted for this patient.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardContent className="p-6">
            <div className="mb-5 flex items-center gap-2">
              <Stethoscope className="size-5 text-primary" />
              <h2 className="font-bold">Recent visits</h2>
            </div>
            <div className="space-y-3">
              {visits.length ? (
                visits.map((visit) => (
                  <div
                    key={String(visit.id)}
                    className="flex items-center justify-between gap-4 rounded-xl border p-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                        {visit.kind === "Surgery" ? (
                          <HeartPulse />
                        ) : (
                          <UserRound />
                        )}
                      </span>
                      <div>
                        <p className="font-semibold">
                          {text(
                            (visit.surgery as CrmRecord | undefined)?.name ??
                              visit.reason,
                            String(visit.kind),
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {doctorName(visit)}
                        </p>
                      </div>
                    </div>
                    <div className="text-end">
                      <Badge variant="outline" className="capitalize">
                        {text(visit.status)}
                      </Badge>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(
                          String(visit.scheduledAt),
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                  No visits recorded yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        <div className="space-y-5">
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-2">
                <Droplets className="size-5 text-red-500" />
                <h2 className="font-bold">Medical information</h2>
              </div>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-muted-foreground">Blood type</dt>
                  <dd className="font-semibold">{text(patient.bloodType)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Weight / height</dt>
                  <dd className="font-semibold">
                    {patient.weightKg ? `${patient.weightKg} kg` : "—"} /{" "}
                    {patient.heightCm ? `${patient.heightCm} cm` : "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Diabetes</dt>
                  <dd className="font-semibold">
                    {patient.hasDiabetes ? "Yes" : "No"}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">High blood pressure</dt>
                  <dd className="font-semibold">
                    {patient.hasHypertension ? "Yes" : "No"}
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-muted-foreground">Family</dt>
                  <dd className="font-semibold">
                    {patient.isMarried
                      ? `Married · ${text(patient.childrenCount, "0")} children`
                      : "Not married"}
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-muted-foreground">Allergies</dt>
                  <dd className="whitespace-pre-wrap font-medium">
                    {text(patient.allergies, "No known allergies")}
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-muted-foreground">Medical notes</dt>
                  <dd className="whitespace-pre-wrap font-medium">
                    {text(patient.medicalNotes, "No medical notes")}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 font-bold">Original lead information</h2>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-muted-foreground">Lead code</dt>
                  <dd className="font-semibold">{text(lead?.code)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Source</dt>
                  <dd className="font-semibold">{text(lead?.source)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Interest</dt>
                  <dd className="font-semibold">{text(lead?.interest)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Lead age</dt>
                  <dd className="font-semibold">{text(lead?.age)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </section>

      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent className="flex max-h-[min(90vh,760px)] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
          <DialogHeader className="shrink-0 border-b px-6 py-5">
            <DialogTitle>Edit patient profile</DialogTitle>
          </DialogHeader>
          <form
            className="flex min-h-0 flex-1 flex-col overflow-hidden"
            onSubmit={save}
          >
            <div className="grid min-h-0 flex-1 gap-4 overflow-y-auto px-6 py-5 sm:grid-cols-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar]:w-1.5">
              {[
                ["firstName", "First name"],
                ["lastName", "Last name"],
                ["phone", "Phone"],
                ["email", "Email"],
                ["address", "Address"],
              ].map(([name, label]) => (
                <label key={name} className="grid gap-1.5 text-sm font-medium">
                  {label}
                  <Input
                    name={name}
                    defaultValue={text(patient[name], "")}
                    required={["firstName", "lastName", "phone"].includes(name)}
                  />
                </label>
              ))}
              <label className="grid gap-1.5 text-sm font-medium">
                Gender
                <Select name="gender" defaultValue={text(patient.gender, "")}>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("crm.placeholders.selectGender")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </label>
              <label className="grid gap-1.5 text-sm font-medium">
                Blood type
                <Select
                  name="bloodType"
                  defaultValue={text(patient.bloodType, "")}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("crm.placeholders.selectBloodType")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                      (value) => (
                        <SelectItem key={value} value={value}>
                          {value}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </label>
              <label className="grid gap-1.5 text-sm font-medium">
                Weight (kg)
                <Input
                  name="weightKg"
                  type="number"
                  min="1"
                  max="500"
                  step="0.1"
                  defaultValue={text(patient.weightKg, "")}
                />
              </label>
              <label className="grid gap-1.5 text-sm font-medium">
                Height (cm)
                <Input
                  name="heightCm"
                  type="number"
                  min="1"
                  max="300"
                  step="0.1"
                  defaultValue={text(patient.heightCm, "")}
                />
              </label>
              <Label
                htmlFor="isMarried"
                className="flex cursor-pointer items-center gap-3 rounded-lg border p-3"
              >
                <Checkbox
                  id="isMarried"
                  checked={isMarried}
                  onCheckedChange={(checked) => setIsMarried(checked === true)}
                />
                Married
              </Label>
              <label className="grid gap-1.5 text-sm font-medium">
                Number of children
                <Input
                  name="childrenCount"
                  type="number"
                  min="0"
                  step="1"
                  disabled={!isMarried}
                  defaultValue={text(patient.childrenCount, "0")}
                />
              </label>
              <Label
                htmlFor="hasDiabetes"
                className="flex cursor-pointer items-center gap-3 rounded-lg border p-3"
              >
                <Checkbox
                  id="hasDiabetes"
                  checked={hasDiabetes}
                  onCheckedChange={(checked) =>
                    setHasDiabetes(checked === true)
                  }
                />
                Has diabetes
              </Label>
              <Label
                htmlFor="hasHypertension"
                className="flex cursor-pointer items-center gap-3 rounded-lg border p-3"
              >
                <Checkbox
                  id="hasHypertension"
                  checked={hasHypertension}
                  onCheckedChange={(checked) =>
                    setHasHypertension(checked === true)
                  }
                />
                Has high blood pressure
              </Label>
              {["allergies", "medicalNotes"].map((name) => (
                <label
                  key={name}
                  className="grid gap-1.5 text-sm font-medium sm:col-span-2"
                >
                  {name === "allergies" ? "Allergies" : "Medical notes"}
                  <Textarea
                    name={name}
                    defaultValue={text(patient[name], "")}
                    className="min-h-24 resize-y"
                  />
                </label>
              ))}
            </div>
            <div className="flex shrink-0 justify-end border-t bg-background px-6 py-4">
              <Button type="submit">Save changes</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="flex h-[min(90vh,800px)] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
          <DialogHeader className="border-b px-6 py-5">
            <DialogTitle>Submit patient form</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={submitClinicalForm}
            className="flex min-h-0 flex-1 flex-col"
          >
            <ScrollArea className="h-0 min-h-0 flex-1">
              <div className="grid gap-4 p-6 sm:grid-cols-2">
                <Label className="grid gap-2 sm:col-span-2">
                  Form or examination
                  <Select
                    value={selectedTemplate?.id ?? ""}
                    onValueChange={(templateId) => {
                      setSelectedTemplate(
                        templates.data?.find(
                          (template) => template.id === templateId,
                        ) ?? null,
                      );
                      setFormValues({});
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("crm.placeholders.chooseForm")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.data?.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name} · {template.category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Label>
                {selectedTemplate?.fields.map((field) => {
                  const setValue = (value: unknown) =>
                    setFormValues((current) => ({
                      ...current,
                      [field.id]: value,
                    }));
                  return field.type === "checkbox" ? (
                    <Label
                      key={field.id}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border p-3"
                    >
                      <Checkbox
                        checked={Boolean(formValues[field.id])}
                        onCheckedChange={(checked) =>
                          setValue(checked === true)
                        }
                      />
                      {field.label}
                    </Label>
                  ) : (
                    <Label
                      key={field.id}
                      className={`grid gap-2 ${field.type === "textarea" ? "sm:col-span-2" : ""}`}
                    >
                      {field.label}
                      {field.type === "select" ? (
                        <Select
                          value={String(formValues[field.id] ?? "")}
                          onValueChange={setValue}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t("crm.placeholders.selectField", {
                                field: field.label,
                              })}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : field.type === "date" ? (
                        <FormDatePicker
                          value={String(formValues[field.id] ?? "")}
                          onValueChange={setValue}
                          required={field.required}
                        />
                      ) : field.type === "textarea" ? (
                        <Textarea
                          required={field.required}
                          value={String(formValues[field.id] ?? "")}
                          onChange={(event) => setValue(event.target.value)}
                        />
                      ) : (
                        <Input
                          type={field.type}
                          required={field.required}
                          value={String(formValues[field.id] ?? "")}
                          onChange={(event) =>
                            setValue(
                              field.type === "number" && event.target.value
                                ? Number(event.target.value)
                                : event.target.value,
                            )
                          }
                        />
                      )}
                    </Label>
                  );
                })}
              </div>
            </ScrollArea>
            <div className="flex justify-end border-t p-4">
              <Button type="submit" disabled={!selectedTemplate}>
                Submit form
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
