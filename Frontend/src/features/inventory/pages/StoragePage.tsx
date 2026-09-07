import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Eye, Pencil, Trash2, Printer, Download } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/shared/components/ui/dropdown-menu";
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
import { apiErrorMessage } from "@/shared/api/client";
import { hasPermission, storedUser } from "@/features/auth/access";
const columns = [
  "name",
  "size",
  "code",
  "category",
  "buy",
  "sell",
  "profit",
  "quantity",
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
export default function StoragePage() {
  const { t, i18n } = useTranslation();
  const data = useApiResource(
    useCallback(async () => {
      const [products, warehouses, categories, stock] = await Promise.all([
        inventoryApi.all("products"),
        inventoryApi.all("warehouses"),
        inventoryApi.all("categories"),
        inventoryApi.all("stock"),
      ]);
      return {
        products: products.filter((p) => p.status === "active"),
        warehouses,
        categories,
        stock,
      };
    }, []),
  );
  const [search, setSearch] = useState("");
  const [warehouse, setWarehouse] = useState("all");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [ascending, setAscending] = useState(true);
  const [visible, setVisible] = useState<Column[]>([...columns]);
  const [selected, setSelected] = useState<RecordItem | null>(null);
  const [mode, setMode] = useState<"view" | "edit" | "remove">("view");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const canManage = hasPermission(storedUser(), "inventory.manage");
  const money = (value: number) =>
    new Intl.NumberFormat(i18n.language, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  const rows = (data.data?.products ?? [])
    .filter(
      (p) =>
        (category === "all" || p.categoryId === category) &&
        `${p.name} ${p.sku} ${p.barcode ?? ""}`
          .toLocaleLowerCase()
          .includes(search.toLocaleLowerCase()),
    )
    .map((p): RecordItem & { quantity: number } => ({
      ...p,
      quantity: (data.data?.stock ?? [])
        .filter(
          (s) =>
            s.productId === p.id &&
            (warehouse === "all" || s.warehouseId === warehouse),
        )
        .reduce((sum, s) => sum + Number(s.quantity), 0),
    }))
    .sort(
      (a, b) =>
        (ascending ? 1 : -1) * a.name.localeCompare(b.name, i18n.language),
    );
  const totalPages = Math.max(1, Math.ceil(rows.length / 10));
  const currentPage = Math.min(page, totalPages);
  const totals = rows.reduce(
    (sum, p) => ({
      buy: sum.buy + p.costPrice * p.quantity,
      sell: sum.sell + p.sellingPrice * p.quantity,
    }),
    { buy: 0, sell: 0 },
  );
  const cell = (p: RecordItem, key: Column) =>
    ({
      name: p.name,
      size: p.size || "—",
      code: p.sku,
      category: p.category?.name || "—",
      buy: money(p.costPrice),
      sell: money(p.sellingPrice),
      profit: money(p.sellingPrice - p.costPrice),
      quantity: `${money(p.quantity)} ${p.unit}`,
    })[key];
  function open(p: RecordItem, action: typeof mode) {
    setSelected({ ...p });
    setMode(action);
    setError("");
  }
  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!selected || busy || !canManage) return;
    setBusy(true);
    setError("");
    try {
      if (mode === "remove") await inventoryApi.remove("products", selected.id);
      else
        await inventoryApi.update("products", selected.id, {
          ...selected,
          costPrice: Number(selected.costPrice),
          sellingPrice: Number(selected.sellingPrice),
        });
      setSelected(null);
      await data.refresh();
    } catch (cause) {
      setError(apiErrorMessage(cause));
    } finally {
      setBusy(false);
    }
  }
  function exportCsv() {
    const quote = (value: unknown) => {
      let text = String(value ?? "");
      if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
      return `"${text.replace(/"/g, '""')}"`;
    };
    const csv = [
      visible.map((key) => t(`storageView.${key}`)),
      ...rows.map((p) => visible.map((key) => cell(p, key))),
    ]
      .map((row) => row.map(quote).join(","))
      .join("\r\n");
    const url = URL.createObjectURL(
      new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "storage.csv";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function print() {
    const popup = window.open("", "_blank", "width=1100,height=800");
    if (!popup) {
      setError(t("buyHistory.popupBlocked"));
      return;
    }
    popup.opener = null;
    popup.document.write(
      `<html dir="${i18n.dir()}"><head><meta charset="utf-8"><title>${escapeHtml(t("warehouseModule.storage"))}</title><style>body{font:12px Arial;padding:24px}table{width:100%;border-collapse:collapse}td,th{padding:8px;border-bottom:1px solid #ddd;text-align:start}@page{size:A4 landscape}</style></head><body><h1>${escapeHtml(t("warehouseModule.storage"))}</h1><table><thead><tr>${visible.map((key) => `<th>${escapeHtml(t(`storageView.${key}`))}</th>`).join("")}</tr></thead><tbody>${rows.map((p) => `<tr>${visible.map((key) => `<td>${escapeHtml(cell(p, key))}</td>`).join("")}</tr>`).join("")}</tbody></table>${["buy", "sell", "profit"].map((key) => `<p>${escapeHtml(t(`storageView.total${key}`))}: ${money(key === "buy" ? totals.buy : key === "sell" ? totals.sell : totals.sell - totals.buy)}</p>`).join("")}</body></html>`,
    );
    popup.document.close();
    popup.focus();
    popup.print();
  }
  return (
    <div className="space-y-5" dir={i18n.dir()}>
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">{t("warehouseModule.storage")}</h1>
      </div>
      {(data.error || (!selected && error)) && (
        <p role="alert" className="text-destructive">
          {data.error || error}
        </p>
      )}
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 p-4">
          <Input
            className="w-full sm:w-72"
            aria-label={t("storageView.search")}
            placeholder={t("storageView.search")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          {(
            [
              [warehouse, setWarehouse, data.data?.warehouses, "allStorage"],
              [category, setCategory, data.data?.categories, "allCategory"],
            ] as const
          ).map(([value, change, items, key]) => (
            <Select
              key={key}
              value={value}
              onValueChange={(value) => {
                change(value);
                setPage(1);
              }}
            >
              <SelectTrigger
                className="w-full sm:w-60"
                aria-label={t(`storageView.${key}`)}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t(`storageView.${key}`)}</SelectItem>
                {items?.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ms-auto">
                {t("storageView.columns")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {columns.map((key) => (
                <DropdownMenuCheckboxItem
                  key={key}
                  checked={visible.includes(key)}
                  disabled={visible.length === 1 && visible.includes(key)}
                  onCheckedChange={(checked) =>
                    setVisible((keys) =>
                      checked
                        ? columns.filter((c) => c === key || keys.includes(c))
                        : keys.filter((c) => c !== key),
                    )
                  }
                >
                  {t(`storageView.${key}`)}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              {visible.map((key) => (
                <TableHead key={key}>
                  {key === "name" ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAscending((v) => !v)}
                    >
                      {t("storageView.name")} {ascending ? "↓" : "↑"}
                    </Button>
                  ) : (
                    t(`storageView.${key}`)
                  )}
                </TableHead>
              ))}
              <TableHead>{t("transferForm.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody autoPaginate={false}>
            {data.isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={visible.length + 1}
                  className="h-28 text-center"
                >
                  {t("resourceState.loading")}
                </TableCell>
              </TableRow>
            ) : rows.length ? (
              rows.slice((currentPage - 1) * 10, currentPage * 10).map((p) => (
                <TableRow key={p.id}>
                  {visible.map((key) => (
                    <TableCell key={key}>{cell(p, key)}</TableCell>
                  ))}
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        aria-label={t("storageView.view")}
                        onClick={() => open(p, "view")}
                      >
                        <Eye className="size-4" />
                      </Button>
                      {canManage && (
                        <>
                          <Button
                            size="icon"
                            aria-label={t("storageView.edit")}
                            onClick={() => open(p, "edit")}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            aria-label={t("storageView.remove")}
                            onClick={() => open(p, "remove")}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={visible.length + 1}
                  className="h-28 text-center"
                >
                  {t("storageView.empty")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="grid gap-3 border-t p-4 sm:grid-cols-3">
          {(["buy", "sell", "profit"] as const).map((key) => (
            <div key={key}>
              <p className="text-sm text-muted-foreground">
                {t(`storageView.total${key}`)}
              </p>
              <p className="text-lg font-semibold">
                {money(
                  key === "buy"
                    ? totals.buy
                    : key === "sell"
                      ? totals.sell
                      : totals.sell - totals.buy,
                )}
              </p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t p-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={data.isLoading || !rows.length}
              onClick={print}
            >
              <Printer className="size-4" />
              {t("buyHistory.print")}
            </Button>
            <Button
              variant="outline"
              disabled={data.isLoading || !rows.length}
              onClick={exportCsv}
            >
              <Download className="size-4" />
              {t("storageView.export")}
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm">
              {currentPage} / {totalPages} · {rows.length}
            </span>
            <Button
              variant="outline"
              disabled={currentPage <= 1}
              onClick={() => setPage(currentPage - 1)}
            >
              {t("transferForm.previous")}
            </Button>
            <Button
              variant="outline"
              disabled={currentPage >= totalPages}
              onClick={() => setPage(currentPage + 1)}
            >
              {t("transferForm.next")}
            </Button>
          </div>
        </div>
      </Card>
      <Dialog
        open={!!selected}
        onOpenChange={(value) => {
          if (!value && !busy) setSelected(null);
        }}
      >
        <DialogContent
          dir={i18n.dir()}
          className="max-h-[85vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle>
              {t(`storageView.${mode}`)} — {selected?.name}
            </DialogTitle>
          </DialogHeader>
          {error && (
            <p role="alert" className="text-destructive">
              {error}
            </p>
          )}
          {selected &&
            (mode === "view" ? (
              <dl className="grid grid-cols-2 gap-3">
                {columns.map((key) => (
                  <div key={key}>
                    <dt className="text-sm text-muted-foreground">
                      {t(`storageView.${key}`)}
                    </dt>
                    <dd>{cell(selected, key)}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <form onSubmit={save} className="space-y-4">
                {mode === "remove" ? (
                  <p>{t("storageView.confirmRemove")}</p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {(
                      [
                        ["name", "name"],
                        ["sku", "code"],
                        ["costPrice", "buy"],
                        ["sellingPrice", "sell"],
                      ] as const
                    ).map(([field, label]) => (
                      <div key={field} className="space-y-2">
                        <Label htmlFor={`storage-${field}`}>
                          {t(`storageView.${label}`)}
                        </Label>
                        <Input
                          id={`storage-${field}`}
                          required
                          disabled={busy}
                          type={field.includes("Price") ? "number" : "text"}
                          min={0}
                          step="0.01"
                          value={selected[field]}
                          onChange={(e) =>
                            setSelected({
                              ...selected,
                              [field]: e.target.value,
                            })
                          }
                        />
                      </div>
                    ))}
                  </div>
                )}
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={busy}
                    onClick={() => setSelected(null)}
                  >
                    {t("common.cancel")}
                  </Button>
                  <Button
                    disabled={busy}
                    variant={mode === "remove" ? "destructive" : "default"}
                  >
                    {t(
                      busy
                        ? "buyHistory.processing"
                        : mode === "remove"
                          ? "storageView.remove"
                          : "common.save",
                    )}
                  </Button>
                </DialogFooter>
              </form>
            ))}
        </DialogContent>
      </Dialog>
    </div>
  );
}
