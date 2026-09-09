import { useCallback, useDeferredValue, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowRightLeft,
  Eye,
  MessageCircle,
  Phone,
  Printer,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
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
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/shared/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";

import { apiClient, apiErrorMessage } from "@/shared/api/client";
import { useApiResource } from "@/shared/hooks/useApiResource";
import { hasPermission, storedUser } from "@/features/auth/access";
type Order = {
  id: string;
  departmentName: string;
  type: string;
  createdAt: string;
  deadline: string | null;
  note: string;
  status: string;
  price: string | null;
  reason: string;
  phone: string | null;
  items: {
    name: string;
    quantity: number;
    warehouseName?: string;
    sellingPrice?: string;
  }[];
};
const columns = [
  "departmentName",
  "type",
  "totalProducts",
  "date",
  "deadline",
  "note",
  "status",
  "price",
  "reason",
] as const;
const statuses = ["pending", "approved", "completed", "rejected"];
const esc = (v: unknown) =>
  String(v ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
export default function DepartmentOrdersPage() {
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState("");
  const query = useDeferredValue(search);
  const [department, setDepartment] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const visible: string[] = [...columns];
  const [departments, setDepartments] = useState<
    { id: string; name: string }[]
  >([]);
  const [selected, setSelected] = useState<Order | null>(null);
  const [mode, setMode] = useState<"details" | "comments" | "contact">(
    "details",
  );
  const [nextStatus, setNextStatus] = useState("pending");
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const canManage = hasPermission(storedUser(), "inventory.manage");
  const result = useApiResource(
    useCallback(
      () =>
        apiClient
          .get<{
            items: Order[];
            pagination: { total: number; totalPages: number };
          }>("/inventory/department-orders", {
            params: {
              search: query,
              departmentId: department === "all" ? undefined : department,
              status: status === "all" ? undefined : status,
              page,
              pageSize: 10,
            },
          })
          .then((r) => r.data),
      [query, department, status, page],
    ),
  );
  const selectedId = selected?.id;
  const comments = useApiResource(
    useCallback(
      () =>
        selectedId && mode === "comments"
          ? apiClient
              .get<{ id: string; note: string; createdAt: string }[]>(
                `/inventory/department-orders/${selectedId}/comments`,
              )
              .then((r) => r.data)
          : Promise.resolve([]),
      [selectedId, mode],
    ),
  );
  useEffect(() => {
    void apiClient
      .get<{ id: string; name: string }[]>(
        "/inventory/department-orders/departments",
      )
      .then((r) => setDepartments(r.data))
      .catch((e) => setError(apiErrorMessage(e)));
  }, []);
  const money = (v: string | null) =>
    v === null
      ? t("departmentOrders.noPrice")
      : new Intl.NumberFormat(i18n.language, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(Number(v));
  const value = (row: Order, key: (typeof columns)[number]) =>
    key === "totalProducts"
      ? row.items.length
      : key === "date"
        ? new Date(row.createdAt).toLocaleString(i18n.language)
        : key === "deadline"
          ? row.deadline
            ? new Date(row.deadline).toLocaleDateString(i18n.language)
            : "—"
          : key === "price"
            ? money(row.price)
            : key === "status" || key === "type"
              ? t(`departmentOrders.${row[key]}`)
              : row[key] || "—";
  const open = (row: Order, nextMode: typeof mode) => {
    setSelected(row);
    setMode(nextMode);
    setNextStatus(row.status);
    setReason(row.reason || "");
    setComment("");
    setError("");
  };
  const print = (row: Order) => {
    const win = window.open("", "_blank", "width=1000,height=800");
    if (!win) {
      setError(t("buyHistory.popupBlocked"));
      return;
    }
    win.opener = null;
    win.document.write(
      `<!doctype html><html dir="${i18n.dir()}"><head><meta charset="utf-8"><title>${esc(row.id)}</title><style>body{font:14px Arial;padding:24px}table{width:100%;border-collapse:collapse}td,th{padding:10px;border-bottom:1px solid #ddd;text-align:start}p{white-space:pre-wrap}@page{size:A4;margin:15mm}</style></head><body><h1>${esc(t("departmentOrders.title"))}</h1><p>${esc(row.id)}</p>${columns.map((k) => `<p><b>${esc(t(`departmentOrders.${k}`))}:</b> ${esc(value(row, k))}</p>`).join("")}<table><thead><tr><th>${esc(t("orderForm.product"))}</th><th>${esc(t("orderForm.quantity"))}</th></tr></thead><tbody>${row.items.map((i) => `<tr><td>${esc(i.name)}</td><td>${esc(i.quantity)}</td></tr>`).join("")}</tbody></table></body></html>`,
    );
    win.document.close();
    win.focus();
    win.print();
  };
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selected || busy || !canManage) return;
    setBusy(true);
    setError("");
    try {
      if (mode === "comments") {
        await apiClient.post(
          `/inventory/department-orders/${selected.id}/comments`,
          { note: comment },
        );
        setComment("");
        await comments.refresh();
      } else {
        const response = await apiClient.patch<Order>(
          `/inventory/department-orders/${selected.id}`,
          {
            status: nextStatus,
            reason,
          },
        );
        setSelected(response.data);
        await result.refresh();
      }
    } catch (e) {
      setError(apiErrorMessage(e));
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="space-y-4 pb-8">
      <header className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold">
          {t("departmentOrders.title")}
        </h1>
      </header>
      {(result.error || (error && !selected)) && (
        <p role="alert" className="text-destructive">
          {result.error || error}
        </p>
      )}
      <Card className="overflow-hidden">
        <div className="flex flex-wrap gap-2 p-3">
          <Input
            className="sm:w-72"
            aria-label={t("departmentOrders.search")}
            placeholder={t("departmentOrders.search")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <Select
            value={department}
            onValueChange={(v) => {
              setDepartment(v);
              setPage(1);
            }}
          >
            <SelectTrigger
              className="sm:w-60"
              aria-label={t("departmentOrders.filterDepartment")}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("departmentOrders.filterDepartment")}
              </SelectItem>
              {departments.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={status}
            onValueChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
          >
            <SelectTrigger
              className="sm:w-60"
              aria-label={t("departmentOrders.filterStatus")}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t("departmentOrders.filterStatus")}
              </SelectItem>
              {statuses.map((s) => (
                <SelectItem key={s} value={s}>
                  {t(`departmentOrders.${s}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="ms-auto"></div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              {columns
                .filter((k) => visible.includes(k))
                .map((k) => (
                  <TableHead key={k}>{t(`departmentOrders.${k}`)}</TableHead>
                ))}
              <TableHead>
                <span className="sr-only">{t("orderForm.actions")}</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody autoPaginate={false}>
            {result.isLoading || result.error || !result.data?.items.length ? (
              <TableRow>
                <TableCell
                  colSpan={visible.length + 1}
                  className="h-28 text-center text-muted-foreground"
                >
                  {t(
                    result.isLoading
                      ? "resourceState.loading"
                      : result.error
                        ? "warehouseDashboard.unavailable"
                        : "orderHistory.empty",
                  )}
                </TableCell>
              </TableRow>
            ) : (
              result.data.items.map((row) => (
                <TableRow key={row.id}>
                  {columns
                    .filter((k) => visible.includes(k))
                    .map((k) => (
                      <TableCell
                        key={k}
                        className="max-w-64 whitespace-pre-wrap break-words"
                      >
                        {k === "status" ||
                        (k === "deadline" && row.deadline) ? (
                          <Badge
                            className={`bg-zinc-900 ${k === "status" && row.status === "rejected" ? "text-red-400" : "text-emerald-300"}`}
                          >
                            {value(row, k)}
                          </Badge>
                        ) : (
                          value(row, k)
                        )}
                      </TableCell>
                    ))}
                  <TableCell>
                    <div className="flex justify-end gap-1.5">
                      {canManage && row.status === "pending" && (
                        <Button
                          size="sm"
                          disabled={busy}
                          onClick={() => {
                            open(row, "details");
                            setNextStatus("approved");
                          }}
                        >
                          <ArrowRightLeft className="size-4" />
                          {t("departmentOrders.startMovement")}
                        </Button>
                      )}
                      <Button
                        size="icon"
                        variant="outline"
                        className="size-8"
                        aria-label={t("departmentOrders.comments")}
                        onClick={() => open(row, "comments")}
                      >
                        <MessageCircle className="size-4" />
                      </Button>
                      <Button
                        size="icon"
                        className="size-8 bg-teal-500 text-white hover:bg-teal-600"
                        aria-label={t("buyHistory.print")}
                        onClick={() => print(row)}
                      >
                        <Printer className="size-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="size-8"
                        aria-label={t("orderHistory.view")}
                        onClick={() => open(row, "details")}
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        size="icon"
                        className="size-8 bg-orange-500 text-white hover:bg-orange-600"
                        aria-label={t("departmentOrders.contact")}
                        disabled={!row.phone}
                        onClick={() => open(row, "contact")}
                      >
                        <Phone className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <footer className="flex items-center justify-between gap-3 border-t p-3">
          <p className="text-xs text-muted-foreground">
            {t("orderHistory.pagination", {
              page,
              pages: result.data?.pagination.totalPages ?? 1,
              total: result.data?.pagination.total ?? 0,
            })}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={result.isLoading || page <= 1}
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
      <Dialog
        open={!!selected}
        onOpenChange={(v) => {
          if (!v && !busy) setSelected(null);
        }}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selected?.departmentName} · {t(`departmentOrders.${mode}`)}
            </DialogTitle>
            <DialogDescription>{selected?.id}</DialogDescription>
          </DialogHeader>
          {error && (
            <p role="alert" className="text-destructive">
              {error}
            </p>
          )}
          {mode === "contact" ? (
            <p className="text-lg" dir="ltr">
              {selected?.phone}
            </p>
          ) : mode === "comments" ? (
            <>
              <div className="space-y-3">
                {comments.isLoading ? (
                  <p>{t("resourceState.loading")}</p>
                ) : comments.error ? (
                  <p role="alert" className="text-destructive">
                    {comments.error}
                  </p>
                ) : (
                  comments.data?.map((c) => (
                    <Card key={c.id} className="p-3">
                      <p className="whitespace-pre-wrap text-sm">{c.note}</p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {new Date(c.createdAt).toLocaleString(i18n.language)}
                      </p>
                    </Card>
                  ))
                )}
              </div>
              {canManage && (
                <form onSubmit={save} className="space-y-3">
                  <Label htmlFor="department-comment">
                    {t("departmentOrders.comments")}
                  </Label>
                  <Textarea
                    id="department-comment"
                    required
                    maxLength={5000}
                    disabled={busy}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <Button disabled={busy || !comment.trim()}>
                    {t("departmentOrders.save")}
                  </Button>
                </form>
              )}
            </>
          ) : (
            selected && (
              <>
                <p className="whitespace-pre-wrap text-sm">{selected.note}</p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("orderForm.product")}</TableHead>
                      <TableHead>{t("orderForm.quantity")}</TableHead>
                      <TableHead>
                        {t("inventory.fields.sellingPrice")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody autoPaginate={false}>
                    {selected.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {item.name}
                          <p className="text-xs text-muted-foreground">
                            {item.warehouseName}
                          </p>
                        </TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          {money(item.sellingPrice ?? null)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <form onSubmit={save} className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {t("departmentRequest.approvalHelp")}
                  </p>
                  <Label>{t("departmentOrders.status")}</Label>
                  <Select
                    disabled={busy || !canManage}
                    value={nextStatus}
                    onValueChange={setNextStatus}
                  >
                    <SelectTrigger aria-label={t("departmentOrders.status")}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        selected.status,
                        ...(selected.status === "pending"
                          ? ["approved", "rejected"]
                          : selected.status === "approved"
                            ? ["completed"]
                            : []),
                      ].map((s) => (
                        <SelectItem key={s} value={s}>
                          {t(`departmentOrders.${s}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Label htmlFor="department-price">
                    {t("departmentOrders.price")}
                  </Label>
                  <Input
                    id="department-price"
                    type="number"
                    min="0"
                    max="100000000"
                    step="0.01"
                    readOnly
                    value={selected.price ?? ""}
                  />
                  <Label htmlFor="department-reason">
                    {t("departmentOrders.reason")}
                  </Label>
                  <Textarea
                    id="department-reason"
                    required={nextStatus === "rejected"}
                    maxLength={5000}
                    disabled={busy || !canManage}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                  {canManage && (
                    <Button disabled={busy}>
                      {t(
                        selected.status === "pending" &&
                          nextStatus === "approved"
                          ? "departmentOrders.approveMovement"
                          : "departmentOrders.save",
                      )}
                    </Button>
                  )}
                </form>
              </>
            )
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
