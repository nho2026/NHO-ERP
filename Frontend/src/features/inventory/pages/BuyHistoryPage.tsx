import { PurchaseFilters, type PurchaseExtraFilters } from "../components/PurchaseFilters";
import { BuyProductForm } from "../components/BuyProductForm";
import type { ReactNode } from "react";
import { Card } from "@/shared/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/shared/components/ui/table";
import {
  useCallback,
  useDeferredValue,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Eye, Pencil, Printer, RotateCcw, Search, Trash2 } from "lucide-react";
import { apiClient, apiErrorMessage } from "@/shared/api/client";
import { useApiResource } from "@/shared/hooks/useApiResource";
import { hasPermission, storedUser } from "@/features/auth/access";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";

import { productImageUrl } from "../api/inventory.api";

type Purchase = {
  id: string;
  invoiceNumber: string;
  retailer: string;
  buyDate: string;
  salesperson: string;
  note: string;
  totalPrice: string;
  isDebt: boolean;
  status: string;
  hasInvoice: boolean;
  attachmentUrl: string | null;
  items: {
    productId: string;
    warehouseId: string;
    productName: string;
    unit?: string;
    warehouseName: string;
    quantity: number;
    price: number;
    totalPrice: number;
  }[];
};
const columns = [
  "invoiceNumber",
  "retailer",
  "totalProducts",
  "hasInvoice",
  "note",
  "totalPrice",
] as const;
type Column = (typeof columns)[number];
const escapeHtml = (value: unknown) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
export default function BuyHistoryPage({
  title = "warehouseModule.buyHistory",
  headerAction,
}: { title?: string; headerAction?: ReactNode } = {}) {
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState(
    () => new URLSearchParams(window.location.search).get("search") ?? "",
  );
  const [extraFilters, setExtraFilters] = useState<PurchaseExtraFilters>({});
  const [hasInvoice, setHasInvoice] = useState("");
  const [retailer, setRetailer] = useState("");
  const [page, setPage] = useState(1);
  const query = useDeferredValue(search);
  const visible: Column[] = [...columns];
  const [editing, setEditing] = useState<Purchase | null>(null);
  const [editBusy, setEditBusy] = useState(false);
  const canEdit = hasPermission(storedUser(), "inventory.purchases.update");
  const [selected, setSelected] = useState<Purchase | null>(null);
  const [action, setAction] = useState<{
    purchase: Purchase;
    kind: "return" | "delete";
  } | null>(null);
  const [returnPassword, setReturnPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const [error, setError] = useState("");
  const canReturn = hasPermission(storedUser(), "inventory.purchases.return");
  const canDelete =
    hasPermission(storedUser(), "inventory.purchases.delete");
  const result = useApiResource(
    useCallback(
      () =>
        apiClient
          .get<{
            items: Purchase[];
            pagination: { total: number; totalPages: number };
          }>("/inventory/purchases", {
            params: { ...extraFilters, page, pageSize: 10, search: query, retailer, hasInvoice },
          })
          .then((r) => r.data),
      [page, query, retailer, hasInvoice, extraFilters],
    ),
  );
  const money = (value: string | number) =>
    new Intl.NumberFormat(i18n.language, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value));
  const label = (column: Column) =>
    t(
      column === "hasInvoice" ? "buyHistory.invoiceFilter" : column === "totalProducts"
        ? "buyHistory.totalProducts"
        : `buyProductForm.${column}`,
    );
  const value = (row: Purchase, column: Column) =>
    column === "hasInvoice" ? t(row.hasInvoice ? "buyHistory.withInvoice" : "buyHistory.withoutInvoice") : column === "totalProducts"
      ? row.items.length
      : column === "totalPrice"
        ? money(row.totalPrice)
        : row[column] || "—";
  const print = (row: Purchase) => {
    const target = window.open("", "_blank", "width=1000,height=800");
    if (!target) {
      setError(t("buyHistory.popupBlocked"));
      return;
    }
    target.opener = null;
    const heading = (key: string) => escapeHtml(t(key));
    target.document.write(
      `<!doctype html><html dir="${i18n.dir()}"><head><meta charset="utf-8"><title>${escapeHtml(row.invoiceNumber)}</title><style>body{font:14px Arial,sans-serif;padding:32px;color:#172b36}h1{color:#128775}table{width:100%;border-collapse:collapse;margin:24px 0}th,td{text-align:start;border-bottom:1px solid #ddd;padding:12px}th{background:#edf8f5}p{white-space:pre-wrap}@page{size:A4;margin:15mm}</style></head><body><h1>${heading("warehouseModule.buyProduct")} · ${escapeHtml(row.invoiceNumber)}</h1><p>${heading("buyProductForm.retailer")}: ${escapeHtml(row.retailer)}</p><p>${heading("buyProductForm.buyDate")}: ${escapeHtml(new Date(row.buyDate).toLocaleDateString(i18n.language))}</p><p>${heading("buyProductForm.salesperson")}: ${escapeHtml(row.salesperson || "—")}</p><p>${heading(row.isDebt ? "buyHistory.debt" : "buyHistory.paid")} · ${heading(`buyHistory.${row.status}`)}</p><table><thead><tr>${["product", "storage", "quantity", "price", "totalPrice"].map((key) => `<th>${heading(`buyProductForm.${key}`)}</th>`).join("")}</tr></thead><tbody>${row.items.map((item) => `<tr><td>${escapeHtml(item.productName)}</td><td>${escapeHtml(item.warehouseName)}</td><td>${escapeHtml(item.quantity)} ${escapeHtml(item.unit ?? "")}</td><td>${escapeHtml(money(item.price))}</td><td>${escapeHtml(money(item.totalPrice))}</td></tr>`).join("")}</tbody></table><h2>${heading("buyProductForm.totalPrice")}: ${escapeHtml(money(row.totalPrice))}</h2><p>${heading("buyProductForm.note")}: ${escapeHtml(row.note || "—")}</p></body></html>`,
    );
    target.document.close();
    target.focus();
    target.print();
  };
  const confirm = async () => {
    if (!action || lock.current || (action.kind === "return" && !returnPassword)) return;
    lock.current = true;
    setBusy(true);
    setError("");
    try {
      if (action.kind === "return")
        await apiClient.post(
          `/inventory/purchases/${action.purchase.id}/return`,
          { password: returnPassword },
        );
      else await apiClient.delete(`/inventory/purchases/${action.purchase.id}`);
      setReturnPassword("");
      setAction(null);
      if (
        action.kind === "delete" &&
        result.data?.items.length === 1 &&
        page > 1
      )
        setPage((p) => p - 1);
      else await result.refresh();
    } catch (cause) {
      setError(apiErrorMessage(cause));
    } finally {
      setBusy(false);
      lock.current = false;
    }
  };
  return (
    <div className="space-y-4 pb-8">
      <header className="flex items-center gap-3 border-b pb-4">
        <h1 className="text-xl font-semibold">{t(title)}</h1>

        {headerAction}
      </header>
      {(result.error || (error && !action)) && (
        <p
          role="alert"
          className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
        >
          {result.error || error}
        </p>
      )}
      <Card className="overflow-hidden rounded-xl border bg-card">
        <div className="flex flex-wrap gap-3 p-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute start-3 top-3 size-4 text-muted-foreground" />
            <Input
              className="ps-9"
              aria-label={t("buyHistory.search")}
              placeholder={t("buyHistory.search")}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <PurchaseFilters value={{ ...extraFilters, retailer, hasInvoice }} onApply={(filters) => {
            const { retailer: _retailer, hasInvoice: _hasInvoice, status: _status, ...extra } = filters;
            setExtraFilters(extra);
            setRetailer(filters.retailer);
            setHasInvoice(filters.hasInvoice);
            setPage(1);
          }} />
          <div className="ms-auto"></div>
        </div>
        <div className="overflow-x-auto">
          <Table className="w-full text-sm">
            <TableHeader className="border-b text-xs text-muted-foreground">
              <TableRow>
                {columns
                  .filter((column) => visible.includes(column))
                  .map((column) => (
                    <TableHead
                      key={column}
                      className="px-4 py-3 text-start font-medium"
                    >
                      {label(column)}
                    </TableHead>
                  ))}
                <TableHead className="px-4 py-3">
                  <span className="sr-only">{t("buyHistory.actions")}</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody autoPaginate={false}>
              {result.isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={visible.length + 1}
                    className="p-10 text-center text-muted-foreground"
                  >
                    {t("resourceState.loading")}
                  </TableCell>
                </TableRow>
              ) : result.error ? (
                <TableRow>
                  <TableCell
                    colSpan={visible.length + 1}
                    className="p-10 text-center text-muted-foreground"
                  >
                    {t("warehouseDashboard.unavailable")}
                  </TableCell>
                </TableRow>
              ) : !result.data?.items.length ? (
                <TableRow>
                  <TableCell
                    colSpan={visible.length + 1}
                    className="p-12 text-center text-muted-foreground"
                  >
                    {t("buyHistory.empty")}
                  </TableCell>
                </TableRow>
              ) : (
                result.data.items.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-b transition hover:bg-muted/30"
                  >
                    {columns
                      .filter((column) => visible.includes(column))
                      .map((column) => (
                        <TableCell
                          key={column}
                          className={`px-4 py-3 ${column === "note" ? "max-w-64 whitespace-pre-wrap break-words" : ""}`}
                        >
                          {value(row, column)}
                          {column === "invoiceNumber" &&
                            row.status === "returned" && (
                              <span className="ms-2 rounded bg-amber-500/10 px-2 py-1 text-xs text-amber-700 dark:text-amber-300">
                                {t("buyHistory.returned")}
                              </span>
                            )}
                        </TableCell>
                      ))}
                    <TableCell className="px-3 py-2">
                      <div className="flex justify-end gap-2">
                        {[
                          {
                            icon: Printer,
                            label: "print",
                            onClick: () => print(row),
                            color:
                              "bg-primary text-primary-foreground hover:bg-primary/90",
                            disabled: false,
                          },
                          {
                            icon: Eye,
                            label: "view",
                            onClick: () => setSelected(row),
                            color: "border bg-background hover:bg-muted",
                            disabled: false,
                          },
                          ...(canEdit ? [{
                            icon: Pencil, label: "edit", onClick: () => setEditing(row),
                            color: "border bg-background hover:bg-muted", disabled: row.status !== "completed",
                          }] : []),
                          ...(canReturn
                            ? [
                                {
                                  icon: RotateCcw,
                                  label: "return",
                                  onClick: () => {
                                    if (row.hasInvoice && !row.attachmentUrl) {
                                      setError(t("buyProductForm.attachmentRequired"));
                                      return;
                                    }
                                    setError("");
                                    setReturnPassword("");
                                    setAction({
                                      purchase: row,
                                      kind: "return",
                                    });
                                  },
                                  color:
                                    "bg-primary text-primary-foreground hover:bg-primary/90",
                                  disabled: row.status !== "completed",
                                },
                              ]
                            : []),
                          ...(canDelete
                            ? [
                                {
                                  icon: Trash2,
                                  label: "delete",
                                  onClick: () => {
                                    if (!row.attachmentUrl) {
                                      setError(t("buyProductForm.attachmentRequired"));
                                      return;
                                    }
                                    setError("");
                                    setReturnPassword("");
                                    setAction({
                                      purchase: row,
                                      kind: "delete",
                                    });
                                  },
                                  color:
                                    "bg-red-500 text-white hover:bg-red-600",
                                  disabled: false,
                                },
                              ]
                            : []),
                        ].map(
                          ({
                            icon: Icon,
                            label: key,
                            onClick,
                            color,
                            disabled,
                          }) => (
                            <Button
                              permission={key === "edit" ? "update" : key} data-action={key === "delete" ? "delete" : undefined}
                              key={key}
                              variant="ghost"
                              size="icon"
                              className={`size-8 rounded-md ${color}`}
                              disabled={disabled}
                              title={t(`buyHistory.${key}`)}
                              aria-label={`${t(`buyHistory.${key}`)} ${row.invoiceNumber}`}
                              onClick={onClick}
                            >
                              <Icon className="size-3.5" />
                            </Button>
                          ),
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <footer className="flex flex-wrap items-center justify-between gap-3 p-3 text-xs text-muted-foreground">
          <span>
            {t("buyHistory.pagination", {
              page,
              pages: result.data?.pagination.totalPages ?? 1,
              total: result.data?.pagination.total ?? 0,
            })}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1 || result.isLoading}
              onClick={() => setPage((p) => p - 1)}
            >
              {t("buyHistory.previous")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={
                result.isLoading ||
                page >= (result.data?.pagination.totalPages ?? 1)
              }
              onClick={() => setPage((p) => p + 1)}
            >
              {t("buyHistory.next")}
            </Button>
          </div>
        </footer>
      </Card>
      <Dialog open={!!editing} onOpenChange={(open) => { if (!open && !editBusy) setEditing(null); }}>
        <DialogContent dir={i18n.dir()} className="flex max-h-[90dvh] flex-col gap-0 overflow-hidden p-0 sm:max-w-[min(96vw,1200px)]">
          <DialogHeader className="shrink-0 px-6 py-5">
            <DialogTitle>{t("buyHistory.edit")} · {editing?.invoiceNumber}</DialogTitle>
          </DialogHeader>
          {editing && <BuyProductForm key={editing.id} purchase={editing} onBusy={setEditBusy} onSaved={() => {
            setEditing(null);
            void result.refresh();
          }} />}
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {t("buyProductForm.invoiceNumber")} · {selected?.invoiceNumber}
            </DialogTitle>
            <DialogDescription>{selected?.retailer}</DialogDescription>
          </DialogHeader>
          {selected && (
            <>
              <div className="grid gap-3 rounded-lg bg-muted/40 p-4 text-sm sm:grid-cols-2">
                <p>
                  {t("buyProductForm.buyDate")}:{" "}
                  {new Date(selected.buyDate).toLocaleDateString(i18n.language)}
                </p>
                <p>
                  {t("buyProductForm.salesperson")}:{" "}
                  {selected.salesperson || "—"}
                </p>
                <p>
                  {t(selected.isDebt ? "buyHistory.debt" : "buyHistory.paid")}
                </p>
                <p>{t(`buyHistory.${selected.status}`)}</p>
              </div>
              <div className="overflow-x-auto">
                <Table className="w-full text-sm">
                  <TableHeader>
                    <TableRow>
                      {[
                        "product",
                        "storage",
                        "quantity",
                        "price",
                        "totalPrice",
                      ].map((key) => (
                        <TableHead
                          key={key}
                          className="border-b p-2 text-start"
                        >
                          {t(`buyProductForm.${key}`)}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody autoPaginate={false}>
                    {selected.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="border-b p-2">
                          {item.productName}
                        </TableCell>
                        <TableCell className="border-b p-2">
                          {item.warehouseName}
                        </TableCell>
                        <TableCell className="border-b p-2">
                          {item.quantity} {item.unit ?? ""}
                        </TableCell>
                        <TableCell className="border-b p-2">
                          {money(item.price)}
                        </TableCell>
                        <TableCell className="border-b p-2">
                          {money(item.totalPrice)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <p className="whitespace-pre-wrap text-sm">
                {selected.note || "—"}
              </p>
              <p className="text-end font-semibold">
                {t("buyProductForm.totalPrice")}: {money(selected.totalPrice)}
              </p>
              {selected.attachmentUrl && (
                <a
                  href={productImageUrl(selected.attachmentUrl)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-primary underline"
                >
                  {t("buyProductForm.attachment")}
                </a>
              )}
              <Button permission="print"
                onClick={() => print(selected)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Printer className="size-4" />
                {t("buyHistory.print")}
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!action}
        onOpenChange={(open) => {
          if (!open && !busy) { setReturnPassword(""); setAction(null); }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t(
                action?.kind === "return"
                  ? "buyHistory.returnTitle"
                  : "buyHistory.deleteTitle",
              )}
            </DialogTitle>
            <DialogDescription>
              {t(
                action?.kind === "return"
                  ? "buyHistory.returnDescription"
                  : "buyHistory.deleteDescription",
                { invoice: action?.purchase.invoiceNumber },
              )}
            </DialogDescription>
          </DialogHeader>
          {action?.kind === "return" && (
            <div className="space-y-2">
              <Label htmlFor="purchase-return-password">{t("buyHistory.returnPassword")}</Label>
              <Input
                id="purchase-return-password"
                type="password"
                autoComplete="current-password"
                value={returnPassword}
                onChange={(event) => setReturnPassword(event.target.value)}
                disabled={busy}
                maxLength={128}
                autoFocus
                onKeyDown={(event) => {
                  if (event.key === "Enter" && returnPassword && !busy) { event.preventDefault(); void confirm(); }
                }}
                required
              />
            </div>
          )}
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              disabled={busy}
              onClick={() => { setReturnPassword(""); setAction(null); }}
            >
              {t("buyHistory.cancel")}
            </Button>
            <Button permission={action?.kind === "return" ? "return" : "delete"}
              variant="destructive"
              disabled={busy || (action?.kind === "return" && !returnPassword)}
              onClick={() => void confirm()}
            >
              {t(
                busy
                  ? "buyHistory.processing"
                  : action?.kind === "return"
                    ? "buyHistory.return"
                    : "buyHistory.delete",
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
