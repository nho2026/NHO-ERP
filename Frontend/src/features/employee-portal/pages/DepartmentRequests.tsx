import { storedUser } from "@/features/auth/access";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Trash2 } from "lucide-react";
import { apiClient, apiErrorMessage } from "@/shared/api/client";
import { useApiResource } from "@/shared/hooks/useApiResource";
import {
  type PageData,
  type RecordItem,
} from "@/features/inventory/api/inventory.api";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { SearchableFilter } from "@/shared/components/ui/searchable-filter";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/shared/components/ui/table";
type Line = { id: string; stockId: string; quantity: string };
const newLine = (): Line => ({
  id: crypto.randomUUID(),
  stockId: "",
  quantity: "1",
});
export default function DepartmentRequests() {
  const { t, i18n } = useTranslation();
  const isSuperadmin = !!storedUser()?.roles?.some(
    (role) => role.name === "Super Administrator",
  );
  const [departmentId, setDepartmentId] = useState("");
  const departments = useApiResource(
    useCallback(
      () =>
        isSuperadmin
          ? apiClient
              .get<RecordItem[]>("/inventory/department-orders/departments")
              .then((r) => r.data)
          : Promise.resolve([]),
      [isSuperadmin],
    ),
  );
  const [page, setPage] = useState(1);
  const orders = useApiResource(
    useCallback(
      () =>
        apiClient
          .get<PageData>("/inventory/department-requests", {
            params: { page, pageSize: 10 },
          })
          .then((r) => r.data),
      [page],
    ),
  );
  const catalog = useApiResource(
    useCallback(
      () =>
        apiClient
          .get<RecordItem[]>("/inventory/department-requests/catalog")
          .then((r) => r.data),
      [],
    ),
  );
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([newLine()]);
  const [type, setType] = useState("disposable");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const lock = useRef(false);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (lock.current) return;
    setError("");
    if (
      (isSuperadmin && !departmentId) ||
      !lines.length ||
      lines.some(
        (line) =>
          !line.stockId ||
          !Number.isFinite(Number(line.quantity)) ||
          Number(line.quantity) <= 0,
      )
    ) {
      setError(t("departmentRequest.invalid"));
      return;
    }
    lock.current = true;
    setBusy(true);
    try {
      await apiClient.post("/inventory/department-requests", {
        ...(isSuperadmin && { departmentId }),
        type,
        note,
        items: lines.map((line) => {
          const stock = catalog.data?.find((s) => s.id === line.stockId);
          return {
            productId: stock?.productId,
            warehouseId: stock?.warehouseId,
            quantity: Number(line.quantity),
          };
        }),
      });
      setOpen(false);
      setLines([newLine()]);
      setNote("");
      setPage(1);
      await orders.refresh();
    } catch (cause) {
      setError(apiErrorMessage(cause));
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  return (
    <Card className="overflow-hidden" dir={i18n.dir()}>
      <div className="flex items-center justify-between gap-3 p-4">
        <h2 className="font-semibold">{t("departmentRequest.title")}</h2>
        <Button
          disabled={catalog.isLoading || !!catalog.error}
          onClick={() => {
            setError("");
            setOpen(true);
            void catalog.refresh();
          }}
        >
          <Plus className="size-4" />
          {t("departmentRequest.new")}
        </Button>
      </div>
      {(orders.error || catalog.error) && (
        <p role="alert" className="px-4 pb-3 text-sm text-destructive">
          {orders.error || catalog.error}
        </p>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            {["date", "totalProducts", "note", "status", "reason"].map((k) => (
              <TableHead key={k}>{t(`departmentOrders.${k}`)}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody autoPaginate={false}>
          {orders.isLoading || !orders.data?.items.length ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                {t(
                  orders.isLoading
                    ? "resourceState.loading"
                    : "resourceState.notFound",
                )}
              </TableCell>
            </TableRow>
          ) : (
            orders.data.items.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  {new Date(order.createdAt).toLocaleString(i18n.language)}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {order.items.map(
                      (
                        item: {
                          name: string;
                          quantity: number;
                          warehouseName?: string;
                        },
                        index: number,
                      ) => (
                        <p key={index}>
                          {item.name} × {item.quantity} · {item.warehouseName}
                        </p>
                      ),
                    )}
                  </div>
                </TableCell>
                <TableCell>{order.note || "—"}</TableCell>
                <TableCell>{t(`departmentOrders.${order.status}`)}</TableCell>
                <TableCell>{order.reason || "—"}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="flex justify-end gap-2 border-t p-3">
        <Button
          variant="outline"
          disabled={page <= 1 || orders.isLoading}
          onClick={() => setPage((p) => p - 1)}
        >
          {t("transferForm.previous")}
        </Button>
        <Button
          variant="outline"
          disabled={
            orders.isLoading ||
            page >= (orders.data?.pagination.totalPages ?? 1)
          }
          onClick={() => setPage((p) => p + 1)}
        >
          {t("transferForm.next")}
        </Button>
      </div>
      <Dialog
        open={open}
        onOpenChange={(v) => {
          if (!lock.current) setOpen(v);
        }}
      >
        <DialogContent
          dir={i18n.dir()}
          className="max-h-[85dvh] overflow-y-auto sm:max-w-2xl"
        >
          <DialogHeader>
            <DialogTitle>{t("departmentRequest.new")}</DialogTitle>
            <DialogDescription>{t("departmentRequest.help")}</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            {error && (
              <p role="alert" className="text-destructive">
                {error}
              </p>
            )}
            <fieldset disabled={busy} className="space-y-4">
              {isSuperadmin && (
                <div className="space-y-2">
                  <Label>{t("departmentOrders.departmentName")}</Label>
                  <SearchableFilter
                    value={departmentId}
                    onValueChange={setDepartmentId}
                    label={t("departmentOrders.filterDepartment")}
                    className="w-full"
                    options={(departments.data ?? []).map((item) => ({
                      value: item.id,
                      label: item.name,
                    }))}
                  />
                  {departments.error && (
                    <p role="alert" className="text-destructive">
                      {departments.error}
                    </p>
                  )}
                </div>
              )}
              <div className="space-y-2">
                <Label>{t("departmentOrders.type")}</Label>
                <SearchableFilter
                  value={type}
                  onValueChange={setType}
                  label={t("departmentOrders.type")}
                  className="w-full"
                  options={["disposable", "equipment"].map((value) => ({
                    value,
                    label: t(`departmentOrders.${value}`),
                  }))}
                />
              </div>
              {lines.map((line) => (
                <div
                  key={line.id}
                  className="grid items-end gap-3 rounded-lg border p-3 sm:grid-cols-[1fr_100px_36px]"
                >
                  <div className="min-w-0 space-y-2">
                    <Label>{t("departmentRequest.productStorage")}</Label>
                    <SearchableFilter
                      className="w-full"
                      label={t("departmentRequest.productStorage")}
                      value={line.stockId}
                      onValueChange={(stockId) =>
                        setLines((items) =>
                          items.map((item) =>
                            item.id === line.id ? { ...item, stockId } : item,
                          ),
                        )
                      }
                      options={(catalog.data ?? []).map((stock) => ({
                        value: stock.id,
                        label: `${stock.product.name} · ${stock.warehouse.name} (${stock.quantity})`,
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={line.id}>{t("orderForm.quantity")}</Label>
                    <Input
                      id={line.id}
                      type="number"
                      min="0.001"
                      max="1000000"
                      step="0.001"
                      required
                      value={line.quantity}
                      onChange={(e) =>
                        setLines((items) =>
                          items.map((item) =>
                            item.id === line.id
                              ? { ...item, quantity: e.target.value }
                              : item,
                          ),
                        )
                      }
                    />
                  </div>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    aria-label={t("buyProductForm.remove")}
                    onClick={() =>
                      setLines((items) =>
                        items.filter((item) => item.id !== line.id),
                      )
                    }
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                disabled={lines.length >= 100}
                onClick={() => setLines((items) => [...items, newLine()])}
              >
                <Plus className="size-4" />
                {t("buyProductForm.addItem")}
              </Button>
              <div className="space-y-2">
                <Label htmlFor="department-request-note">
                  {t("orderForm.note")}
                </Label>
                <Textarea
                  id="department-request-note"
                  maxLength={5000}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </fieldset>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={busy}
                onClick={() => setOpen(false)}
              >
                {t("common.cancel")}
              </Button>
              <Button disabled={busy || catalog.isLoading || !lines.length}>
                {t(busy ? "buyHistory.processing" : "orderForm.submit")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
