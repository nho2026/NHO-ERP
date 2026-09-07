import { SearchableFilter } from "@/shared/components/ui/searchable-filter";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Printer } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/components/ui/select";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/shared/components/ui/table";
import { inventoryApi, type RecordItem } from "../api/inventory.api";
import { useApiResource } from "@/shared/hooks/useApiResource";
const headings = [
  "name",
  "size",
  "code",
  "category",
  "date",
  "days",
  "quantity",
  "status",
];
const escape = (value: unknown) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
const dayNumber = (date: string) =>
  Date.parse(`${date.slice(0, 10)}T00:00:00Z`) / 86400000;
export default function ExpireSoonPage() {
  const { t, i18n } = useTranslation();
  const result = useApiResource(
    useCallback(async () => {
      const [products, warehouses, categories] = await Promise.all([
        inventoryApi.all("products"),
        inventoryApi.all("warehouses"),
        inventoryApi.all("categories"),
      ]);
      return {
        products: products.filter((p) => p.status === "active"),
        warehouses,
        categories,
        today: new Intl.DateTimeFormat("en-CA", {
          timeZone: "Asia/Baghdad",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(new Date()),
      };
    }, []),
  );
  const [search, setSearch] = useState("");
  const [warehouse, setWarehouse] = useState("all");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("soon");
  const [maximum, setMaximum] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const days = (p: RecordItem) =>
    p.expiryDate && result.data
      ? Math.round(dayNumber(p.expiryDate) - dayNumber(result.data.today))
      : null;
  const state = (p: RecordItem) => {
    const d = days(p);
    return d === null
      ? "unknown"
      : d < 0
        ? "expired"
        : d <= 30
          ? "soon"
          : "valid";
  };
  const quantity = (p: RecordItem) =>
    (p.stocks ?? [])
      .filter(
        (s: RecordItem) => warehouse === "all" || s.warehouseId === warehouse,
      )
      .reduce((sum: number, s: RecordItem) => sum + Number(s.quantity), 0);
  const rows = (result.data?.products ?? [])
    .filter(
      (p) =>
        (category === "all" || p.categoryId === category) &&
        (warehouse === "all" ||
          p.stocks?.some((s: RecordItem) => s.warehouseId === warehouse)) &&
        `${p.name} ${p.sku} ${p.barcode ?? ""}`
          .toLocaleLowerCase()
          .includes(search.toLocaleLowerCase()) &&
        (status === "all" || state(p) === status) &&
        (maximum === "" || (days(p) !== null && days(p)! <= Number(maximum))),
    )
    .sort(
      (a, b) =>
        (days(a) ?? Infinity) - (days(b) ?? Infinity) ||
        a.name.localeCompare(b.name),
    );
  const pages = Math.max(1, Math.ceil(rows.length / 10));
  const current = Math.min(page, pages);
  const cells = (p: RecordItem) => [
    p.name,
    p.size || "—",
    p.sku,
    p.category?.name || "—",
    p.expiryDate
      ? new Date(`${p.expiryDate.slice(0, 10)}T12:00:00Z`).toLocaleDateString(
          i18n.language,
          { timeZone: "UTC" },
        )
      : t("expiry.unknown"),
    days(p) ?? "—",
    new Intl.NumberFormat(i18n.language, { maximumFractionDigits: 3 }).format(
      quantity(p),
    ),
    t(`expiry.${state(p)}`),
  ];
  function print() {
    const popup = window.open("", "_blank", "width=1100,height=800");
    if (!popup) {
      setError(t("buyHistory.popupBlocked"));
      return;
    }
    popup.opener = null;
    popup.document.write(
      `<html dir="${i18n.dir()}"><head><meta charset="utf-8"><title>${escape(t("warehouseModule.expireSoon"))}</title><style>body{font:12px Arial;padding:24px}table{width:100%;border-collapse:collapse}th,td{padding:8px;border-bottom:1px solid #ddd;text-align:start}@page{size:A4 landscape}</style></head><body><h1>${escape(t("warehouseModule.expireSoon"))}</h1><p>${escape(result.data?.today)}</p><table><thead><tr>${headings.map((k) => `<th>${escape(t(`expiry.${k}`))}</th>`).join("")}</tr></thead><tbody>${rows
        .map(
          (p) =>
            `<tr>${cells(p)
              .map((value) => `<td>${escape(value)}</td>`)
              .join("")}</tr>`,
        )
        .join("")}</tbody></table></body></html>`,
    );
    popup.document.close();
    popup.focus();
    popup.print();
  }
  return (
    <div className="space-y-5" dir={i18n.dir()}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {t("warehouseModule.expireSoon")}
        </h1>
      </div>
      {(result.error || error) && (
        <p role="alert" className="text-destructive">
          {result.error || error}
        </p>
      )}
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 p-4">
          <Input
            className="w-full sm:w-64"
            value={search}
            placeholder={t("storageView.search")}
            aria-label={t("storageView.search")}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          {(
            [
              [warehouse, setWarehouse, result.data?.warehouses, "allStorage"],
              [category, setCategory, result.data?.categories, "allCategory"],
            ] as const
          ).map(([value, change, items, key]) => (
            <SearchableFilter
              key={key}
              value={value}
              onValueChange={(v) => {
                change(v);
                setPage(1);
              }}
              label={t(`storageView.${key}`)}
              className="w-full sm:w-48"
              options={[
                { value: "all", label: t(`storageView.${key}`) },
                ...(items ?? []).map((item) => ({
                  value: item.id,
                  label: item.name,
                })),
              ]}
            />
          ))}
          <Select
            value={status}
            onValueChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
          >
            <SelectTrigger
              className="w-full sm:w-48"
              aria-label={t("expiry.status")}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["all", "expired", "soon", "valid", "unknown"].map((k) => (
                <SelectItem key={k} value={k}>
                  {t(`expiry.${k}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            min="0"
            step="1"
            className="w-full sm:w-48"
            value={maximum}
            placeholder={t("expiry.maxDays")}
            aria-label={t("expiry.maxDays")}
            onChange={(e) => {
              setMaximum(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              {headings.map((k) => (
                <TableHead key={k}>{t(`expiry.${k}`)}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody autoPaginate={false}>
            {result.isLoading || !rows.length ? (
              <TableRow>
                <TableCell
                  colSpan={headings.length}
                  className="h-28 text-center text-muted-foreground"
                >
                  {t(
                    result.isLoading
                      ? "resourceState.loading"
                      : "storageView.empty",
                  )}
                </TableCell>
              </TableRow>
            ) : (
              rows.slice((current - 1) * 10, current * 10).map((p) => (
                <TableRow
                  key={p.id}
                  className={
                    state(p) === "expired"
                      ? "bg-red-500/10"
                      : state(p) === "soon"
                        ? "bg-amber-500/10"
                        : state(p) === "valid"
                          ? "bg-emerald-500/10"
                          : ""
                  }
                >
                  {cells(p).map((value, i) => (
                    <TableCell key={headings[i]}>
                      {i === 7 ? (
                        <Badge variant="outline">{value}</Badge>
                      ) : (
                        value
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t p-4">
          <Button
            variant="outline"
            disabled={!rows.length || result.isLoading}
            onClick={print}
          >
            <Printer className="size-4" />
            {t("buyHistory.print")}
          </Button>
          <div className="flex items-center gap-3">
            <span className="text-sm">
              {current} / {pages} · {rows.length}
            </span>
            <Button
              variant="outline"
              disabled={current <= 1}
              onClick={() => setPage(current - 1)}
            >
              {t("transferForm.previous")}
            </Button>
            <Button
              variant="outline"
              disabled={current >= pages}
              onClick={() => setPage(current + 1)}
            >
              {t("transferForm.next")}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
