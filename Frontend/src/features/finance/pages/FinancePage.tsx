import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Trash2,
  WalletCards,
} from "lucide-react";
import {
  financeApi,
  type FinanceRecord,
  type FinanceResource,
} from "../api/finance.api";
import { useApiResource } from "@/shared/hooks/useApiResource";
import { apiErrorMessage } from "@/shared/api/client";
import { FormDatePicker } from "@/shared/components/ui/form-date-picker";
import { TableResourceState } from "@/shared/components/ui/table-resource-state";
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

type PageResource = FinanceResource | "analysis";
type Field = {
  key: string;
  type?: "number" | "date" | "select";
  options?: string[];
};
const configs: Record<FinanceResource, { fields: Field[]; columns: string[] }> =
  {
    budgets: {
      fields: [
        { key: "name" },
        { key: "fiscalYear", type: "number" },
        { key: "department" },
        { key: "category" },
        { key: "plannedAmount", type: "number" },
        { key: "currency" },
        {
          key: "status",
          type: "select",
          options: ["draft", "approved", "closed"],
        },
        { key: "notes" },
      ],
      columns: [
        "name",
        "fiscalYear",
        "department",
        "category",
        "plannedAmount",
        "status",
      ],
    },
    "cash-flow": {
      fields: [
        { key: "flowDate", type: "date" },
        { key: "flowType", type: "select", options: ["inflow", "outflow"] },
        { key: "category" },
        { key: "amount", type: "number" },
        { key: "currency" },
        { key: "description" },
        {
          key: "status",
          type: "select",
          options: ["planned", "confirmed", "cancelled"],
        },
      ],
      columns: [
        "flowDate",
        "flowType",
        "category",
        "description",
        "amount",
        "status",
      ],
    },
    forecasts: {
      fields: [
        { key: "name" },
        {
          key: "scenario",
          type: "select",
          options: ["base", "optimistic", "conservative"],
        },
        { key: "periodStart", type: "date" },
        { key: "periodEnd", type: "date" },
        { key: "projectedRevenue", type: "number" },
        { key: "projectedExpense", type: "number" },
        { key: "currency" },
        {
          key: "status",
          type: "select",
          options: ["draft", "approved", "archived"],
        },
        { key: "notes" },
      ],
      columns: [
        "name",
        "scenario",
        "periodStart",
        "periodEnd",
        "projectedRevenue",
        "projectedExpense",
        "status",
      ],
    },
    funding: {
      fields: [
        { key: "sourceName" },
        {
          key: "fundingType",
          type: "select",
          options: ["grant", "loan", "investment", "donation", "internal"],
        },
        { key: "committedAmount", type: "number" },
        { key: "receivedAmount", type: "number" },
        { key: "currency" },
        { key: "startDate", type: "date" },
        { key: "endDate", type: "date" },
        { key: "interestRate", type: "number" },
        {
          key: "status",
          type: "select",
          options: ["planned", "active", "completed", "cancelled"],
        },
        { key: "notes" },
      ],
      columns: [
        "sourceName",
        "fundingType",
        "committedAmount",
        "receivedAmount",
        "startDate",
        "status",
      ],
    },
  };
const number = (value: unknown) =>
  new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(
    Number(value ?? 0),
  );

type ChartDatum = { label: string; value: number; color: string };
function FinanceBarChart({ items }: { items: ChartDatum[] }) {
  const maximum = Math.max(1, ...items.map((item) => Math.abs(item.value)));
  return (
    <div className="space-y-5">
      {items.map((item) => (
        <div key={item.label} className="space-y-2">
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="font-medium text-muted-foreground">
              {item.label}
            </span>
            <b className="tabular-nums">{number(item.value)} IQD</b>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full min-w-1 rounded-full ${item.color}`}
              style={{ width: `${(Math.abs(item.value) / maximum) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function FundingChart({
  committed,
  received,
  gap,
  labels,
}: {
  committed: number;
  received: number;
  gap: number;
  labels: string[];
}) {
  const percent =
    committed > 0 ? Math.min(100, (received / committed) * 100) : 0;
  return (
    <div className="grid items-center gap-6 sm:grid-cols-[180px_1fr]">
      <div
        className="relative mx-auto grid size-40 place-items-center rounded-full"
        style={{
          background: `conic-gradient(var(--primary) ${percent}%, var(--muted) ${percent}% 100%)`,
        }}
      >
        <div className="grid size-28 place-items-center rounded-full bg-card text-center shadow-inner">
          <div>
            <b className="block text-2xl text-primary">{percent.toFixed(0)}%</b>
            <small className="text-muted-foreground">{labels[1]}</small>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {[
          [labels[0], committed, "bg-sky-500"],
          [labels[1], received, "bg-primary"],
          [labels[2], gap, "bg-amber-500"],
        ].map(([label, value, color]) => (
          <div key={String(label)} className="flex items-center gap-3">
            <i className={`size-3 rounded-full ${color}`} />
            <span className="flex-1 text-sm text-muted-foreground">
              {label}
            </span>
            <b className="text-sm tabular-nums">{number(value)} IQD</b>
          </div>
        ))}
      </div>
    </div>
  );
}
const display = (
  key: string,
  value: unknown,
  t: (key: string, options?: Record<string, unknown>) => string,
) => {
  if (/Date|Start|End/.test(key) && value)
    return new Intl.DateTimeFormat().format(new Date(String(value)));
  if (/Amount|Revenue|Expense|Rate/.test(key)) return number(value);
  if (["status", "flowType", "scenario", "fundingType"].includes(key))
    return t(`finance.values.${String(value)}`, {
      defaultValue: String(value),
    });
  return String(value ?? "—");
};

export default function FinancePage({ resource }: { resource: PageResource }) {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [page, setPage] = useState(1);
  const records = useApiResource(
    useCallback(
      () =>
        resource === "analysis"
          ? Promise.resolve({
              items: [],
              pagination: { page: 1, pageSize: 50, total: 0, totalPages: 1 },
            })
          : financeApi.list(resource, page, 50),
      [resource, page],
    ),
  );
  const analysis = useApiResource(
    useCallback(() => financeApi.analysis(year), [year]),
  );
  const [editing, setEditing] = useState<FinanceRecord | null | undefined>(
    undefined,
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  if (resource === "analysis") {
    const data = analysis.data;
    return (
      <div className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{t("finance.analysis")}</h1>
            <p className="text-sm text-muted-foreground">
              {t("finance.analysisDescription")}
            </p>
          </div>
          <Input
            className="w-32"
            type="number"
            aria-label={t("finance.fields.fiscalYear")}
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          />
        </div>
        <TableResourceState
          isLoading={analysis.isLoading}
          error={analysis.error}
          isEmpty={!data}
          colSpan={1}
        />
        {data && (
          <div className="grid gap-5 xl:grid-cols-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-6 font-semibold text-primary">
                  {t("finance.fields.plannedBudget")}
                </h2>
                <FinanceBarChart
                  items={[
                    {
                      label: t("finance.fields.plannedBudget"),
                      value: data.plannedBudget,
                      color: "bg-sky-500",
                    },
                    {
                      label: t("finance.fields.actualRevenue"),
                      value: data.actualRevenue,
                      color: "bg-emerald-500",
                    },
                    {
                      label: t("finance.fields.actualExpense"),
                      value: data.actualExpense,
                      color: "bg-rose-500",
                    },
                    {
                      label: t("finance.fields.budgetVariance"),
                      value: data.budgetVariance,
                      color: "bg-primary",
                    },
                  ]}
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-6 font-semibold text-primary">
                  {t("finance.cashFlow")}
                </h2>
                <FinanceBarChart
                  items={[
                    {
                      label: t("finance.fields.inflow"),
                      value: data.inflow,
                      color: "bg-emerald-500",
                    },
                    {
                      label: t("finance.fields.outflow"),
                      value: data.outflow,
                      color: "bg-rose-500",
                    },
                    {
                      label: t("finance.fields.netCashFlow"),
                      value: data.netCashFlow,
                      color: "bg-primary",
                    },
                  ]}
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-6 font-semibold text-primary">
                  {t("finance.forecasts")}
                </h2>
                <FinanceBarChart
                  items={[
                    {
                      label: t("finance.fields.projectedRevenue"),
                      value: data.projectedRevenue,
                      color: "bg-emerald-500",
                    },
                    {
                      label: t("finance.fields.projectedExpense"),
                      value: data.projectedExpense,
                      color: "bg-rose-500",
                    },
                    {
                      label: t("finance.fields.projectedNet"),
                      value: data.projectedNet,
                      color: "bg-primary",
                    },
                  ]}
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-5 font-semibold text-primary">
                  {t("finance.funding")}
                </h2>
                <FundingChart
                  committed={data.committedFunding}
                  received={data.receivedFunding}
                  gap={data.fundingGap}
                  labels={[
                    t("finance.fields.committedFunding"),
                    t("finance.fields.receivedFunding"),
                    t("finance.fields.fundingGap"),
                  ]}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  }
  const config = configs[resource];
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    const values = Object.fromEntries(new FormData(event.currentTarget));
    for (const key of Object.keys(values))
      if (values[key] === "") delete values[key];
    try {
      editing
        ? await financeApi.update(resource, editing.id, values)
        : await financeApi.create(resource, values);
      setEditing(undefined);
      await records.refresh();
    } catch (cause) {
      setError(apiErrorMessage(cause));
    } finally {
      setBusy(false);
    }
  };
  const pagination = records.data?.pagination;
  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">
            {t(`finance.${resource === "cash-flow" ? "cashFlow" : resource}`)}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t(
              `finance.descriptions.${resource === "cash-flow" ? "cashFlow" : resource}`,
            )}
          </p>
        </div>
        <Button
          onClick={() => {
            setError("");
            setEditing(null);
          }}
        >
          <Plus />
          {t("finance.add")}
        </Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                {config.columns.map((key) => (
                  <TableHead key={key}>{t(`finance.fields.${key}`)}</TableHead>
                ))}
                <TableHead className="text-end">{t("table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableResourceState
                isLoading={records.isLoading}
                error={records.error}
                isEmpty={!records.data?.items.length}
                colSpan={config.columns.length + 1}
              />
              {!records.isLoading &&
                records.data?.items.map((row) => (
                  <TableRow key={row.id}>
                    {config.columns.map((key) => (
                      <TableCell key={key}>
                        {key === "status" ? (
                          <Badge variant="secondary">
                            {display(key, row[key], t)}
                          </Badge>
                        ) : (
                          display(key, row[key], t)
                        )}
                      </TableCell>
                    ))}
                    <TableCell className="text-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        title={t("finance.edit")}
                        onClick={() => {
                          setError("");
                          setEditing(row);
                        }}
                      >
                        <Pencil />
                      </Button>
                      <DeleteConfirmationDialog
                        description={t("finance.deleteConfirm")}
                        onConfirm={async () => {
                          await financeApi.remove(resource, row.id);
                          await records.refresh();
                        }}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          title={t("finance.delete")}
                          className="text-destructive"
                        >
                          <Trash2 />
                        </Button>
                      </DeleteConfirmationDialog>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          {pagination && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3">
              <span className="text-xs text-muted-foreground">
                {t("finance.pageSummary", {
                  page: pagination.page,
                  totalPages: pagination.totalPages,
                  total: pagination.total,
                })}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={records.isLoading || pagination.page <= 1}
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                >
                  <ChevronLeft className="size-4 rtl:rotate-180" />
                  {t("finance.previous")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={
                    records.isLoading ||
                    pagination.page >= pagination.totalPages
                  }
                  onClick={() => setPage((value) => value + 1)}
                >
                  {t("finance.next")}
                  <ChevronRight className="size-4 rtl:rotate-180" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <Dialog
        open={editing !== undefined}
        onOpenChange={(open) => !open && !busy && setEditing(undefined)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <WalletCards />
              {t(editing ? "finance.edit" : "finance.add")}
            </DialogTitle>
          </DialogHeader>
          <form className="grid gap-3 sm:grid-cols-2" onSubmit={submit}>
            {config.fields.map((field) =>
              field.type === "date" ? (
                <FormDatePicker
                  key={field.key}
                  name={field.key}
                  initialValue={String(editing?.[field.key] ?? "")}
                  required={field.key !== "endDate"}
                />
              ) : field.type === "select" ? (
                <Select
                  key={field.key}
                  name={field.key}
                  defaultValue={String(
                    editing?.[field.key] ?? field.options?.[0],
                  )}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t(`finance.fields.${field.key}`)}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {t(`finance.values.${option}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  key={field.key}
                  name={field.key}
                  type={field.type}
                  step={field.type === "number" ? "0.01" : undefined}
                  min={field.type === "number" ? "0" : undefined}
                  defaultValue={String(
                    editing?.[field.key] ??
                      (field.key === "currency"
                        ? "IQD"
                        : field.key === "fiscalYear"
                          ? currentYear
                          : ""),
                  )}
                  placeholder={t(`finance.fields.${field.key}`)}
                  required={!["department", "notes"].includes(field.key)}
                />
              ),
            )}
            {error && (
              <p className="text-sm text-destructive sm:col-span-2">{error}</p>
            )}
            <Button disabled={busy} className="sm:col-span-2">
              {busy ? t("finance.saving") : t("finance.save")}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
