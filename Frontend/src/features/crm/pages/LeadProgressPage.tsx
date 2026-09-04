import { useCallback, useState } from "react";
import {
  CircleX,
  Clock3,
  ExternalLink,
  Eye,
  LayoutGrid,
  List,
  ListFilter,
  MapPin,
  Phone,
  Search,
  UserRound,
  MoreHorizontal,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { crmApi } from "../api/crm.api";
import { hasPermission, storedUser } from "@/features/auth/access";
import { toast } from "sonner";
import { useApiResource } from "@/shared/hooks/useApiResource";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

const stages = [
  "new",
  "contacted",
  "qualified",
  "appointment_requested",
  "surgery_appointment",
  "converted",
  "direct_surgery_converted",
];
const fallbackLabels: Record<string, string> = {
  new: "Consulted",
  contacted: "Follow-up",
  qualified: "Ready",
  appointment_requested: "OPD Appointment",
  surgery_appointment: "Surgery Appointment",
  converted: "OPD Converted",
  direct_surgery_converted: "Direct Surgery Converted",
  lost: "Lost",
};
const statusStyles: Record<string, string> = {
  new: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300",
  contacted:
    "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-900 dark:bg-cyan-950 dark:text-cyan-300",
  qualified:
    "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950 dark:text-violet-300",
  appointment_requested:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
  converted:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
  direct_surgery_converted:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
  surgery_appointment:
    "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-950 dark:text-orange-300",
  lost: "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
};
const progressColors: Record<string, string> = {
  new: "#2563eb",
  contacted: "#0891b2",
  qualified: "#7c3aed",
  appointment_requested: "#d97706",
  converted: "#059669",
  direct_surgery_converted: "#047857",
  surgery_appointment: "#ea580c",
  lost: "#dc2626",
};
const StatusBadge = ({ status, label }: { status: string; label: string }) => (
  <Badge
    variant="outline"
    className={`whitespace-nowrap capitalize ${statusStyles[status] ?? ""}`}
  >
    <span className="me-1.5 size-1.5 rounded-full bg-current" />
    {label}
  </Badge>
);
function Progress({
  status,
  translate,
  compact = false,
}: {
  status: string;
  compact?: boolean;
  translate: (status: string) => string;
}) {
  const current = stages.indexOf(status);
  const progressColor = status === "lost" ? progressColors.lost : "#10b981";
  if (status === "lost")
    return <StatusBadge status="lost" label={translate("lost")} />;
  return (
    <div
      className={`relative grid grid-cols-7 px-1 pb-1 pt-0.5 ${compact ? "min-w-[520px]" : "min-w-[650px]"}`}
    >
      <span className="absolute inset-x-[10%] top-[7px] h-0.5 bg-blue-100 dark:bg-blue-950" />
      {current > 0 && (
        <span
          className="absolute start-[10%] top-[7px] h-0.5 transition-all duration-500"
          style={{
            width: `${(current / (stages.length - 1)) * 80}%`,
            backgroundColor: progressColor,
          }}
        />
      )}
      {stages.map((stage, index) => (
        <div key={stage} className="relative z-10 flex flex-col items-center">
          <span
            className={`size-3.5 rounded-full border-2 transition-colors ${index <= current ? "" : "border-blue-200 bg-slate-50 dark:border-blue-900 dark:bg-slate-950"}`}
            style={
              index <= current
                ? {
                    borderColor: progressColor,
                    backgroundColor: progressColor,
                    boxShadow: `0 0 0 3px color-mix(in srgb, ${progressColor} 10%, transparent)`,
                  }
                : undefined
            }
          />
          <span
            className={`mt-1.5 max-w-20 text-center leading-[.9] ${compact ? "text-[7px]" : "text-[9px]"} ${index <= current ? "font-semibold" : "font-medium text-slate-400"}`}
            style={index <= current ? { color: progressColor } : undefined}
          >
            {translate(stage)}
          </span>
        </div>
      ))}
    </div>
  );
}
export default function LeadProgressPage() {
  const { t } = useTranslation();
  const canManage = hasPermission(storedUser(), "employees.manage");
  const statusLabel = (status: string) =>
    fallbackLabels[status] ??
    t(`crm.values.${status}`, { defaultValue: status.replaceAll("_", " ") });
  const [view, setView] = useState<"table" | "grid">("table");
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    source: "",
    gender: "",
  });
  const [draft, setDraft] = useState(filters);
  const overview = useApiResource(
    useCallback(() => crmApi.leads.list(1, 100), []),
  );
  const leads = useApiResource(
    useCallback(
      () =>
        crmApi.leads.list(
          1,
          100,
          Object.fromEntries(
            Object.entries(filters).filter(([, value]) => value),
          ),
        ),
      [filters],
    ),
  );
  const rows = (leads.data?.items ?? []).filter((lead) =>
    JSON.stringify(lead).toLowerCase().includes(search.toLowerCase()),
  );
  const activeFilterCount = Object.values(filters).filter(Boolean).length;
  const totals = Object.fromEntries(
    [...stages, "lost"].map((status) => [
      status,
      (overview.data?.items ?? []).filter((lead) => lead.status === status)
        .length,
    ]),
  );
  const markAsLost = async (id: string) => {
    try {
      await crmApi.leads.update(id, { status: "lost" });
      await Promise.all([leads.refresh(), overview.refresh()]);
      toast.success("Lead marked as lost.");
    } catch (error) {
      toast.error(t("crm.errors.markLost"));
    }
  };
  return (
    <div className="mx-auto max-w-[1500px] space-y-5">
      <header>
        <p className="text-xs font-bold uppercase tracking-widest text-primary">
          {t("crm.progress.eyebrow")}
        </p>
        <h1 className="mt-1 text-2xl font-bold">{t("crm.progress.title")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("crm.progress.description")}
        </p>
      </header>
      <section className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {[...stages, "lost"].map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => {
              const next = filters.status === status ? "" : status;
              setFilters((current) => ({ ...current, status: next }));
              setDraft((current) => ({ ...current, status: next }));
            }}
            className={`rounded-xl border p-4 text-start transition-all hover:-translate-y-0.5 hover:shadow-md ${statusStyles[status]} ${filters.status === status ? "ring-2 ring-current ring-offset-2 ring-offset-background" : ""}`}
          >
            <p className="text-xs font-semibold">{statusLabel(status)}</p>
            <p className="mt-1 text-2xl font-bold">{totals[status] ?? 0}</p>
          </button>
        ))}
      </section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-md">
          <Search className="absolute start-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            className="ps-9"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t("crm.progress.search")}
          />
        </div>
        <div className="flex items-center gap-2">
          <Popover open={filterOpen} onOpenChange={setFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <ListFilter />
                {t("crm.progress.filter")}
                {activeFilterCount > 0 && (
                  <Badge className="ms-1 rounded-full px-1.5">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-4">
              <div className="mb-4">
                <p className="font-semibold">{t("crm.progress.filterTitle")}</p>
                <p className="text-xs text-muted-foreground">
                  {t("crm.progress.filterDescription")}
                </p>
              </div>
              <div className="grid gap-3">
                <label className="grid gap-1.5 text-xs font-medium">
                  {t("crm.fields.status")}
                  <Select
                    value={draft.status || "all"}
                    onValueChange={(value) =>
                      setDraft((current) => ({
                        ...current,
                        status: value === "all" ? "" : value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {t("crm.progress.allStatuses")}
                      </SelectItem>
                      {[...stages, "lost"].map((status) => (
                        <SelectItem key={status} value={status}>
                          {statusLabel(status)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </label>
                <label className="grid gap-1.5 text-xs font-medium">
                  {t("crm.fields.source")}
                  <Input
                    value={draft.source}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        source: event.target.value,
                      }))
                    }
                    placeholder={t("crm.placeholders.sourceExamples")}
                  />
                </label>
                <label className="grid gap-1.5 text-xs font-medium">
                  {t("crm.fields.gender")}
                  <Select
                    value={draft.gender || "all"}
                    onValueChange={(value) =>
                      setDraft((current) => ({
                        ...current,
                        gender: value === "all" ? "" : value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {t("crm.progress.allGenders")}
                      </SelectItem>
                      <SelectItem value="male">
                        {t("crm.values.male")}
                      </SelectItem>
                      <SelectItem value="female">
                        {t("crm.values.female")}
                      </SelectItem>
                      <SelectItem value="other">
                        {t("crm.values.other")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </label>
              </div>
              <div className="mt-4 flex justify-end gap-2 border-t pt-4">
                <Button
                  variant="ghost"
                  onClick={() => {
                    const empty = { status: "", source: "", gender: "" };
                    setDraft(empty);
                    setFilters(empty);
                    setFilterOpen(false);
                  }}
                >
                  {t("crm.actions.clear")}
                </Button>
                <Button
                  onClick={() => {
                    setFilters(draft);
                    setFilterOpen(false);
                  }}
                >
                  {t("crm.actions.applyFilters")}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <div className="flex rounded-lg border p-1">
            <Button
              size="sm"
              variant={view === "table" ? "default" : "ghost"}
              onClick={() => setView("table")}
            >
              <List />
              {t("crm.actions.table")}
            </Button>
            <Button
              size="sm"
              variant={view === "grid" ? "default" : "ghost"}
              onClick={() => setView("grid")}
            >
              <LayoutGrid />
              {t("crm.actions.grid")}
            </Button>
          </div>
        </div>
      </div>
      {view === "table" ? (
        <div className="overflow-x-auto rounded-2xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("crm.progress.lead")}</TableHead>
                <TableHead>{t("crm.progress.contact")}</TableHead>
                <TableHead>{t("crm.fields.status")}</TableHead>
                <TableHead>{t("crm.progress.lastUpdate")}</TableHead>
                <TableHead>{t("crm.progress.currentProgress")}</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <p className="font-semibold">{String(lead.name)}</p>
                    <p className="text-xs text-muted-foreground">
                      {String(lead.code ?? "—")}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p>{String(lead.phone)}</p>
                    <p className="text-xs text-muted-foreground">
                      {String(lead.address ?? "—")}
                    </p>
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      status={String(lead.status)}
                      label={statusLabel(String(lead.status))}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(String(lead.updatedAt)).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Progress
                      status={String(lead.status)}
                      translate={statusLabel}
                    />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="icon"
                          variant="outline"
                          aria-label="Lead actions"
                        >
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        {canManage && lead.status !== "lost" && (
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onSelect={() => void markAsLost(lead.id)}
                          >
                            <CircleX /> Mark as Lost
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem asChild>
                          <Link to={`/crm/leads/${lead.id}#timeline`}>
                            <Clock3 /> Timeline
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={`/crm/leads/${lead.id}`}>
                            <ExternalLink /> Lead Details
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((lead) => (
            <Card key={lead.id} className="overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-primary to-cyan-400" />
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
                    <UserRound />
                  </span>
                  <StatusBadge
                    status={String(lead.status)}
                    label={statusLabel(String(lead.status))}
                  />
                </div>
                <h2 className="mt-4 text-lg font-bold">{String(lead.name)}</h2>
                <p className="text-xs text-muted-foreground">
                  {String(lead.code ?? "—")}
                </p>
                <div className="mt-4 grid gap-2 text-sm">
                  <span className="flex items-center gap-2">
                    <Phone className="size-4 text-muted-foreground" />
                    {String(lead.phone)}
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin className="size-4 text-muted-foreground" />
                    {String(lead.address ?? "Not recorded")}
                  </span>
                </div>
                <div className="mt-5 overflow-x-auto">
                  <Progress
                    status={String(lead.status)}
                    compact
                    translate={statusLabel}
                  />
                </div>
                <Button asChild className="mt-5 w-full" variant="outline">
                  <Link to={`/crm/leads/${lead.id}`}>
                    <Eye />
                    {t("crm.progress.view")}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
