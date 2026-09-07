import { Card } from "@/shared/components/ui/card";
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
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/shared/components/ui/table";
import { Label } from "@/shared/components/ui/label";
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Columns3, Eye, PieChart, Printer } from "lucide-react";
import { apiClient, apiErrorMessage } from "@/shared/api/client";
import { useApiResource } from "@/shared/hooks/useApiResource";
import { hasPermission, storedUser } from "@/features/auth/access";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/shared/components/ui/dropdown-menu";
import { productImageUrl } from "../api/inventory.api";
type Debt = {
  id: string;
  invoiceNumber: string;
  retailer: string;
  salesperson: string;
  buyDate: string;
  paidAmount: string;
  totalPrice: string;
  note: string;
  attachmentUrl: string | null;
  items: {
    productName: string;
    warehouseName: string;
    quantity: number;
    price: number;
    totalPrice: number;
  }[];
  payments: { id: string; amount: string; paidAt: string; note: string }[];
};
const columns = [
  "invoiceNumber",
  "retailer",
  "salesperson",
  "totalProducts",
  "status",
  "date",
  "paid",
  "totalPrice",
] as const;
type Column = (typeof columns)[number];
const esc = (v: unknown) =>
  String(v ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
export default function BuyDebtsPage() {
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState("");
  const query = useDeferredValue(search);
  const [retailer, setRetailer] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [retailers, setRetailers] = useState<string[]>([]);
  const [visible, setVisible] = useState<Column[]>([...columns]);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [selected, setSelected] = useState<Debt | null>(null);
  const [paying, setPaying] = useState<Debt | null>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const lock = useRef(false);
  const paymentId = useRef("");
  const canPay = hasPermission(storedUser(), "inventory.manage");
  const result = useApiResource(
    useCallback(
      () =>
        apiClient
          .get<{
            items: Debt[];
            pagination: { total: number; totalPages: number };
            summary: {
              totalPrice: string;
              paidAmount: string;
              outstanding: number;
            };
          }>("/inventory/purchase-debts", {
            params: { search: query, retailer, status, page, pageSize: 10 },
          })
          .then((r) => r.data),
      [query, retailer, status, page],
    ),
  );
  useEffect(() => {
    void apiClient
      .get<string[]>("/inventory/purchases/retailers")
      .then((r) => setRetailers(r.data))
      .catch(() => {});
  }, []);
  const money = (v: string | number) =>
    new Intl.NumberFormat(i18n.language, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(v));
  const balance = (row: Debt) =>
    (Math.round(Number(row.totalPrice) * 100) -
      Math.round(Number(row.paidAmount) * 100)) /
    100;
  const state = (row: Debt) =>
    balance(row) <= 0
      ? "paid"
      : Number(row.paidAmount) > 0
        ? "partial"
        : "unpaid";
  const label = (key: Column) =>
    t(
      ["status", "date", "paid"].includes(key)
        ? `buyDebts.${key}`
        : key === "totalProducts"
          ? "buyHistory.totalProducts"
          : `buyProductForm.${key}`,
    );
  const value = (row: Debt, key: Column): string | number =>
    key === "totalProducts"
      ? row.items.length
      : key === "date"
        ? new Date(row.buyDate).toLocaleDateString(i18n.language)
        : key === "paid"
          ? money(row.paidAmount)
          : key === "totalPrice"
            ? money(row.totalPrice)
            : key === "status"
              ? t(`buyDebts.${state(row)}`)
              : row[key] || "—";
  const print = (rows: Debt[], invoice = false) => {
    const win = window.open("", "_blank", "width=1100,height=800");
    if (!win) {
      setError(t("buyHistory.popupBlocked"));
      return;
    }
    win.opener = null;
    const row = rows[0];
    const extra =
      invoice && row
        ? `<h2>${esc(t("buyProductForm.items"))}</h2><table><thead><tr>${["product", "storage", "quantity", "price", "totalPrice"].map((k) => `<th>${esc(t(`buyProductForm.${k}`))}</th>`).join("")}</tr></thead><tbody>${row.items.map((i) => `<tr><td>${esc(i.productName)}</td><td>${esc(i.warehouseName)}</td><td>${esc(i.quantity)}</td><td>${esc(money(i.price))}</td><td>${esc(money(i.totalPrice))}</td></tr>`).join("")}</tbody></table><h2>${esc(t("buyDebts.payments"))}</h2>${row.payments.map((p) => `<p>${esc(new Date(p.paidAt).toLocaleString(i18n.language))} · ${esc(money(p.amount))} · ${esc(p.note)}</p>`).join("")}<p>${esc(row.note)}</p><h3>${esc(t("buyDebts.remaining"))}: ${esc(money(balance(row)))}</h3>`
        : `<p>${esc(t("buyDebts.printScope"))}</p><h3>${esc(t("buyDebts.totalDebts"))}: ${esc(money(result.data?.summary.outstanding ?? 0))}</h3>`;
    win.document.write(
      `<!doctype html><html dir="${i18n.dir()}"><head><meta charset="utf-8"><title>${esc(t("warehouseModule.buyDebts"))}</title><style>body{font:13px Arial;padding:24px;color:#142c29}h1{color:#168b78}table{width:100%;border-collapse:collapse}th,td{padding:9px;border-bottom:1px solid #ddd;text-align:start}th{background:#eef8f3}p{white-space:pre-wrap}@page{size:A4 landscape;margin:12mm}</style></head><body><h1>${esc(t("warehouseModule.buyDebts"))}</h1><table><thead><tr>${columns.map((k) => `<th>${esc(label(k))}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr>${columns.map((k) => `<td>${esc(value(r, k))}</td>`).join("")}</tr>`).join("")}</tbody></table>${extra}</body></html>`,
    );
    win.document.close();
    win.focus();
    win.print();
  };
  const pay = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!paying || lock.current || !canPay) return;
    setError("");
    if (
      !Number.isFinite(Number(amount)) ||
      Number(amount) <= 0 ||
      Number(amount) > balance(paying)
    ) {
      setError(t("buyDebts.invalidAmount"));
      return;
    }
    lock.current = true;
    setSaving(true);
    try {
      await apiClient.post(`/inventory/purchases/${paying.id}/pay`, {
        requestId: paymentId.current,
        amount: Number(amount),
        note,
      });
      setPaying(null);
      if (result.data?.items.length === 1 && page > 1 && status)
        setPage((p) => p - 1);
      else await result.refresh();
    } catch (cause) {
      setError(apiErrorMessage(cause));
    } finally {
      setSaving(false);
      lock.current = false;
    }
  };
  const selectClass =
    "h-10 rounded-md border bg-background px-3 text-sm w-full sm:w-60";
  return (
    <div className="space-y-4 pb-8">
      <header className="flex items-center gap-3 border-b pb-4">
        <h1 className="text-xl font-semibold">
          {t("warehouseModule.buyDebts")}
        </h1>
      </header>
      {(result.error || (error && !paying)) && (
        <p
          role="alert"
          className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
        >
          {result.error || error}
        </p>
      )}
      <Card className="overflow-hidden rounded-xl border bg-card">
        <div className="flex flex-wrap gap-2 p-3">
          <Input
            className="w-full sm:w-72"
            aria-label={t("buyHistory.search")}
            placeholder={t("buyHistory.search")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <Select
            value={retailer || "__all__"}
            onValueChange={(value) => {
              value = value === "__all__" ? "" : value;
              setRetailer(value);
              setPage(1);
            }}
          >
            <SelectTrigger
              className={selectClass}
              aria-label={t("buyHistory.filterRetailer")}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">
                {t("buyHistory.filterRetailer")}
              </SelectItem>
              {retailers.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={status || "__all__"}
            onValueChange={(value) => {
              value = value === "__all__" ? "" : value;
              setStatus(value);
              setPage(1);
            }}
          >
            <SelectTrigger
              className={selectClass}
              aria-label={t("buyDebts.filterStatus")}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">
                {t("buyDebts.filterStatus")}
              </SelectItem>
              {["paid", "unpaid", "partial"].map((s) => (
                <SelectItem key={s} value={s}>
                  {t(`buyDebts.${s}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            className="bg-teal-500 text-white hover:bg-teal-600"
            size="icon"
            aria-label={t("buyDebts.summary")}
            onClick={() => setSummaryOpen(true)}
            disabled={!result.data || result.isLoading}
          >
            <PieChart className="size-4" />
          </Button>
          <div className="ms-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Columns3 className="size-4" />
                  {t("buyHistory.columns")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {columns.map((key) => (
                  <DropdownMenuCheckboxItem
                    key={key}
                    checked={visible.includes(key)}
                    disabled={visible.length === 1 && visible.includes(key)}
                    onSelect={(e) => e.preventDefault()}
                    onCheckedChange={(checked) =>
                      setVisible((items) =>
                        checked
                          ? [...items, key]
                          : items.filter((k) => k !== key),
                      )
                    }
                  >
                    {label(key)}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table className="w-full text-sm">
            <TableHeader>
              <TableRow>
                {columns
                  .filter((k) => visible.includes(k))
                  .map((k) => (
                    <TableHead
                      key={k}
                      className="whitespace-nowrap px-4 py-3 text-start text-xs font-medium text-muted-foreground"
                    >
                      {label(k)}
                    </TableHead>
                  ))}
                <TableHead>
                  <span className="sr-only">{t("buyHistory.actions")}</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody autoPaginate={false}>
              {result.isLoading ||
              result.error ||
              !result.data?.items.length ? (
                <TableRow>
                  <TableCell
                    colSpan={visible.length + 1}
                    className="p-12 text-center text-muted-foreground"
                  >
                    {t(
                      result.isLoading
                        ? "resourceState.loading"
                        : result.error
                          ? "warehouseDashboard.unavailable"
                          : "buyDebts.empty",
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                result.data.items.map((row) => (
                  <TableRow
                    key={row.id}
                    className={`border-t ${state(row) === "paid" ? "bg-emerald-200/75 dark:bg-emerald-950/60" : state(row) === "partial" ? "bg-amber-100 dark:bg-amber-950/50" : "bg-red-200/75 dark:bg-red-950/50"}`}
                  >
                    {columns
                      .filter((k) => visible.includes(k))
                      .map((key) => (
                        <TableCell key={key} className="px-4 py-3">
                          {key === "status" ? (
                            <span
                              className={`inline-block min-w-16 rounded bg-zinc-900 px-2 py-1 text-center text-xs ${state(row) === "paid" ? "text-emerald-300" : state(row) === "partial" ? "text-amber-300" : "text-red-300"}`}
                            >
                              {value(row, key)}
                            </span>
                          ) : (
                            value(row, key)
                          )}
                        </TableCell>
                      ))}
                    <TableCell className="px-2 py-2">
                      <div className="flex justify-end gap-1.5">
                        <Button
                          size="icon"
                          className="size-8 bg-primary text-primary-foreground hover:bg-primary/90"
                          aria-label={`${t("buyHistory.print")} ${row.invoiceNumber}`}
                          onClick={() => print([row], true)}
                        >
                          <Printer className="size-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="size-8"
                          aria-label={`${t("buyHistory.view")} ${row.invoiceNumber}`}
                          onClick={() => setSelected(row)}
                        >
                          <Eye className="size-3.5" />
                        </Button>
                        {canPay && (
                          <Button
                            size="sm"
                            className="h-8 bg-primary text-primary-foreground hover:bg-primary/90"
                            disabled={balance(row) <= 0}
                            onClick={() => {
                              setPaying(row);
                              setAmount(balance(row).toFixed(2));
                              setNote("");
                              setError("");
                              paymentId.current = crypto.randomUUID();
                            }}
                          >
                            {t("buyDebts.pay")}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="border-y px-4 py-3 font-semibold">
          {t("buyDebts.totalDebts")}:{" "}
          {result.isLoading || result.error
            ? "—"
            : money(result.data?.summary.outstanding ?? 0)}
          <span className="ms-3 text-xs font-normal text-muted-foreground">
            {t("buyDebts.filteredTotal")}
          </span>
        </div>
        <footer className="flex flex-wrap items-center justify-between gap-3 p-3">
          <span className="text-xs text-muted-foreground">
            {t("buyHistory.pagination", {
              page,
              pages: result.data?.pagination.totalPages ?? 1,
              total: result.data?.pagination.total ?? 0,
            })}
          </span>
          <div className="flex gap-2">
            <Button
              size="icon"
              className="size-8 bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={
                result.isLoading || !!result.error || !result.data?.items.length
              }
              aria-label={t("buyDebts.printPage")}
              title={t("buyDebts.printPage")}
              onClick={() => print(result.data?.items ?? [])}
            >
              <Printer className="size-3.5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={result.isLoading || page === 1}
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
      <Dialog open={summaryOpen} onOpenChange={setSummaryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("buyDebts.summary")}</DialogTitle>
            <DialogDescription>{t("buyDebts.filteredTotal")}</DialogDescription>
          </DialogHeader>
          {result.data && (
            <>
              <div
                className="flex h-4 overflow-hidden rounded-full bg-red-200"
                aria-hidden="true"
              >
                <div
                  className="bg-emerald-500"
                  style={{
                    width: `${Number(result.data.summary.totalPrice) > 0 ? (Number(result.data.summary.paidAmount) / Number(result.data.summary.totalPrice)) * 100 : 0}%`,
                  }}
                />
              </div>
              {[
                ["totalPrice", result.data.summary.totalPrice],
                ["paid", result.data.summary.paidAmount],
                ["remaining", result.data.summary.outstanding],
              ].map(([key, amount]) => (
                <p key={key} className="flex justify-between text-sm">
                  <span>
                    {t(
                      key === "totalPrice"
                        ? "buyProductForm.totalPrice"
                        : `buyDebts.${key}`,
                    )}
                  </span>
                  <strong>{money(amount)}</strong>
                </p>
              ))}
            </>
          )}
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
              <p className="text-sm">
                {t("buyDebts.date")}:{" "}
                {new Date(selected.buyDate).toLocaleDateString(i18n.language)} ·{" "}
                {t("buyProductForm.salesperson")}: {selected.salesperson || "—"}
              </p>
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
                    {selected.items.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell className="p-2">
                          {item.productName}
                        </TableCell>
                        <TableCell className="p-2">
                          {item.warehouseName}
                        </TableCell>
                        <TableCell className="p-2">{item.quantity}</TableCell>
                        <TableCell className="p-2">
                          {money(item.price)}
                        </TableCell>
                        <TableCell className="p-2">
                          {money(item.totalPrice)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <p className="font-semibold">
                {t("buyDebts.remaining")}: {money(balance(selected))}
              </p>
              <p className="whitespace-pre-wrap text-sm">{selected.note}</p>
              {selected.attachmentUrl && (
                <a
                  href={productImageUrl(selected.attachmentUrl)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline"
                >
                  {t("buyProductForm.attachment")}
                </a>
              )}
              <h3 className="font-semibold">{t("buyDebts.payments")}</h3>
              {selected.payments.length ? (
                selected.payments.map((p) => (
                  <div key={p.id} className="rounded-lg border p-3 text-sm">
                    <p>
                      {new Date(p.paidAt).toLocaleString(i18n.language)} ·{" "}
                      <strong>{money(p.amount)}</strong>
                    </p>
                    <p className="whitespace-pre-wrap text-muted-foreground">
                      {p.note}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  {t("buyDebts.noPayments")}
                </p>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!paying}
        onOpenChange={(open) => {
          if (!open && !saving) setPaying(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("buyDebts.pay")} · {paying?.invoiceNumber}
            </DialogTitle>
            <DialogDescription>{t("buyDebts.recordHint")}</DialogDescription>
          </DialogHeader>
          <form onSubmit={pay} className="space-y-4">
            <p className="text-sm">
              {t("buyDebts.remaining")}:{" "}
              <strong>{money(paying ? balance(paying) : 0)}</strong>
            </p>
            <Label className="block space-y-2 text-sm">
              {t("buyDebts.amount")}
              <Input
                autoFocus
                type="number"
                min="0.01"
                max={paying ? balance(paying) : 0}
                step="0.01"
                required
                disabled={saving}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Label>
            <Label className="block space-y-2 text-sm">
              {t("buyProductForm.note")}
              <Input
                maxLength={5000}
                disabled={saving}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </Label>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={saving}
                onClick={() => setPaying(null)}
              >
                {t("buyHistory.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {t(saving ? "buyHistory.processing" : "buyDebts.recordPayment")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
