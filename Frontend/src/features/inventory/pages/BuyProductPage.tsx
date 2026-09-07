import { ScrollArea } from "@/shared/components/ui/scroll-area";
import BuyHistoryPage from "./BuyHistoryPage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Card } from "@/shared/components/ui/card";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { FormDatePicker } from "@/shared/components/ui/form-date-picker";
import { CreatableSelect } from "@/shared/components/ui/creatable-select";
import { Label } from "@/shared/components/ui/label";
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
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ImagePlus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { apiClient, apiErrorMessage } from "@/shared/api/client";
import { hasPermission, storedUser } from "@/features/auth/access";
import { useApiResource } from "@/shared/hooks/useApiResource";
import { inventoryApi } from "../api/inventory.api";

type Line = {
  id: string;
  productId: string;
  warehouseId: string;
  quantity: string;
  price: string;
};
const today = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
const newLine = (): Line => ({
  id: crypto.randomUUID(),
  productId: "",
  warehouseId: "",
  quantity: "1",
  price: "0",
});

function BuyProductForm({
  onSaved,
  onBusy,
}: {
  onSaved: () => void;
  onBusy: (busy: boolean) => void;
}) {
  const { t, i18n } = useTranslation();
  const canBuy = hasPermission(storedUser(), "inventory.adjust");
  const canManage = hasPermission(storedUser(), "inventory.manage");
  const options = useApiResource(
    useCallback(async () => {
      const [products, warehouses] = await Promise.all([
        inventoryApi.all("products"),
        inventoryApi.all("warehouses"),
      ]);
      return {
        products: products.filter((p) => p.status === "active"),
        warehouses: warehouses.filter((w) => w.status === "active"),
      };
    }, []),
  );
  const [retailers, setRetailers] = useState<string[]>([]);
  useEffect(() => {
    void apiClient
      .get<string[]>("/inventory/purchases/retailers")
      .then((r) => setRetailers(r.data))
      .catch(() => {});
  }, []);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [buyDate, setBuyDate] = useState(today);
  const [retailer, setRetailer] = useState("");
  const [salesperson, setSalesperson] = useState("");
  const [isDebt, setIsDebt] = useState(false);
  const [note, setNote] = useState("");
  const [lines, setLines] = useState<Line[]>([newLine()]);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const busy = useRef(false);
  const requestId = useRef(crypto.randomUUID());
  const uploadedUrl = useRef<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );
  const setAttachment = (next: File | null) => {
    setFile(next);
    setPreview(next ? URL.createObjectURL(next) : "");
    uploadedUrl.current = null;
  };
  const money = (value: number) =>
    new Intl.NumberFormat(i18n.language, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  const lineTotal = (line: Line) =>
    Math.round(Number(line.quantity) * Math.round(Number(line.price) * 100)) /
    100;
  const total =
    lines.reduce((sum, line) => sum + Math.round(lineTotal(line) * 100), 0) /
    100;
  const changeLine = (id: string, patch: Partial<Line>) =>
    setLines((value) =>
      value.map((line) => (line.id === id ? { ...line, ...patch } : line)),
    );
  const clear = () => {
    setInvoiceNumber("");
    setBuyDate(today());
    setRetailer("");
    setSalesperson("");
    setIsDebt(false);
    setNote("");
    setLines([newLine()]);
    setAttachment(null);
    setError("");
    uploadedUrl.current = null;
    requestId.current = crypto.randomUUID();
    if (fileInput.current) fileInput.current.value = "";
  };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy.current || !canBuy) return;
    setError("");
    setSuccess("");
    if (
      !invoiceNumber.trim() ||
      !retailer.trim() ||
      !lines.length ||
      lines.some(
        (line) =>
          !line.productId ||
          !line.warehouseId ||
          !Number.isFinite(Number(line.quantity)) ||
          Number(line.quantity) <= 0 ||
          !line.price ||
          !Number.isFinite(Number(line.price)) ||
          Number(line.price) < 0,
      )
    ) {
      setError(t("buyProductForm.invalid"));
      return;
    }
    busy.current = true;
    onBusy(true);
    setSaving(true);
    try {
      if (file && !uploadedUrl.current)
        uploadedUrl.current = (
          await inventoryApi.uploadImages([file])
        )[0].imageUrl;
      await apiClient.post("/inventory/purchases", {
        requestId: requestId.current,
        invoiceNumber,
        buyDate,
        retailer,
        salesperson,
        isDebt,
        note,
        attachmentUrl: uploadedUrl.current,
        items: lines.map((line) => ({
          productId: line.productId,
          warehouseId: line.warehouseId,
          quantity: Number(line.quantity),
          price: Number(line.price),
        })),
      });
      setRetailers((value) => [...new Set([...value, retailer.trim()])]);
      clear();
      setSuccess(t("buyProductForm.saved"));
      onSaved();
    } catch (cause) {
      setError(apiErrorMessage(cause));
    } finally {
      busy.current = false;
      onBusy(false);
      setSaving(false);
    }
  };
  const selectClass =
    "h-10 w-full min-w-0 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/50";
  return (
    <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-4 px-6 pb-4">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b pb-5">
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="destructive"
                disabled={saving}
                onClick={() => {
                  clear();
                  setSuccess("");
                }}
              >
                <X className="size-4" />
                {t("buyProductForm.clear")}
              </Button>

              {canManage && (
                <Button
                  asChild
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Link to="/inventory/products">
                    <Plus className="size-4" />
                    {t("warehouseModule.addProduct")}
                  </Link>
                </Button>
              )}
            </div>
          </header>
          {(error || options.error) && (
            <p
              role="alert"
              className="rounded-xl border border-destructive/25 bg-destructive/5 p-4 text-sm text-destructive"
            >
              {error || options.error}
            </p>
          )}
          {success && (
            <p
              role="status"
              className="rounded-xl border border-teal-500/25 bg-teal-500/10 p-4 text-sm text-teal-700 dark:text-teal-300"
            >
              {success}
            </p>
          )}
          <fieldset
            disabled={saving}
            className="grid min-w-0 gap-4 lg:grid-cols-2"
          >
            <div className="min-w-0 space-y-5">
              <Card className="rounded-2xl border bg-card p-5">
                <h2 className="mb-5 text-sm font-semibold">
                  {t("buyProductForm.invoiceDetails")}
                </h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  <Label className="space-y-1.5 text-xs font-medium">
                    {t("buyProductForm.invoiceNumber")}
                    <Input
                      className="mt-1.5"
                      required
                      maxLength={100}
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                    />
                  </Label>
                  <Label className="space-y-1.5 text-xs font-medium">
                    {t("buyProductForm.buyDate")}
                    <FormDatePicker
                      required
                      value={buyDate}
                      onValueChange={setBuyDate}
                    />
                  </Label>
                  <Label className="space-y-1.5 text-xs font-medium">
                    {t("buyProductForm.retailer")}
                    <CreatableSelect
                      required
                      disabled={saving}
                      maxLength={150}
                      placeholder={t("buyProductForm.retailerHint")}
                      value={retailer}
                      onValueChange={setRetailer}
                      options={retailers}
                    />
                  </Label>
                  <Label className="space-y-1.5 text-xs font-medium">
                    {t("buyProductForm.totalPrice")}
                    <Input
                      className="mt-1.5 bg-muted/50 font-semibold"
                      readOnly
                      value={money(total)}
                    />
                  </Label>
                  <Label className="space-y-1.5 text-xs font-medium">
                    {t("buyProductForm.salesperson")}
                    <Input
                      className="mt-1.5"
                      maxLength={150}
                      value={salesperson}
                      onChange={(e) => setSalesperson(e.target.value)}
                    />
                  </Label>
                  <Label className="flex items-center gap-2 self-end rounded-lg border px-3 py-2.5 text-xs font-medium">
                    <Checkbox
                      disabled={saving}
                      checked={isDebt}
                      onCheckedChange={(checked) => setIsDebt(checked === true)}
                    />
                    {t("buyProductForm.isDebt")}
                  </Label>
                  <Label className="space-y-1.5 text-xs font-medium sm:col-span-3">
                    {t("buyProductForm.note")}
                    <Input
                      className="mt-1.5"
                      maxLength={5000}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                  </Label>
                </div>
              </Card>
              <Card className="rounded-2xl border bg-card p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-sm font-semibold">
                    {t("buyProductForm.items")}
                  </h2>
                  <span className="rounded-full bg-teal-500/10 px-2.5 py-1 text-xs font-semibold text-teal-600">
                    {lines.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {lines.map((line, index) => (
                    <div
                      key={line.id}
                      className="rounded-xl border bg-muted/20 p-3"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted-foreground">
                          {t("buyProductForm.item")} {index + 1}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled={lines.length === 1}
                          aria-label={`${t("buyProductForm.remove")} ${index + 1}`}
                          onClick={() =>
                            setLines((value) =>
                              value.filter((row) => row.id !== line.id),
                            )
                          }
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Label className="space-y-1 text-xs">
                          {t("warehouseModule.product")}
                          <Select
                            disabled={saving || options.isLoading}
                            value={line.productId}
                            onValueChange={(value) => {
                              const product = options.data?.products.find(
                                (p) => p.id === value,
                              );
                              changeLine(line.id, {
                                productId: value,
                                price: String(product?.costPrice ?? 0),
                              });
                            }}
                            required
                          >
                            <SelectTrigger className={selectClass}>
                              <SelectValue
                                placeholder={t("buyProductForm.selectProduct")}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {options.data?.products.map((p) => (
                                <SelectItem key={p.id} value={p.id}>
                                  {p.name} · {p.sku}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </Label>
                        <Label className="space-y-1 text-xs">
                          {t("warehouseModule.storage")}
                          <Select
                            disabled={saving || options.isLoading}
                            value={line.warehouseId}
                            onValueChange={(value) =>
                              changeLine(line.id, { warehouseId: value })
                            }
                            required
                          >
                            <SelectTrigger className={selectClass}>
                              <SelectValue
                                placeholder={t("buyProductForm.selectStorage")}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {options.data?.warehouses.map((w) => (
                                <SelectItem key={w.id} value={w.id}>
                                  {w.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </Label>
                        <Label className="space-y-1 text-xs">
                          {t("buyProductForm.quantity")}
                          <Input
                            type="number"
                            required
                            min="0.001"
                            max="1000000"
                            step="0.001"
                            value={line.quantity}
                            onChange={(e) =>
                              changeLine(line.id, { quantity: e.target.value })
                            }
                          />
                        </Label>
                        <Label className="space-y-1 text-xs">
                          {t("buyProductForm.price")}
                          <Input
                            type="number"
                            required
                            min="0"
                            max="100000000"
                            step="0.01"
                            value={line.price}
                            onChange={(e) =>
                              changeLine(line.id, { price: e.target.value })
                            }
                          />
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={lines.length >= 100 || options.isLoading}
                  onClick={() => setLines((value) => [...value, newLine()])}
                >
                  <Plus className="size-4" />
                  {t("buyProductForm.addItem")}
                </Button>
                <p className="mt-3 text-xs text-muted-foreground">
                  {t("buyProductForm.unitHint")}
                </p>
              </Card>
              {!canBuy && (
                <p className="text-sm text-muted-foreground">
                  {t("buyProductForm.noPermission")}
                </p>
              )}
            </div>
            <div className="min-w-0 space-y-5">
              <Card className="rounded-2xl border bg-card p-5">
                <Label
                  className="block text-sm font-semibold"
                  htmlFor="purchase-attachment"
                >
                  {t("buyProductForm.attachment")}
                </Label>
                <Input
                  ref={fileInput}
                  id="purchase-attachment"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  disabled={!canManage}
                  className="mt-3 block w-full rounded-lg border p-2 text-xs file:me-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-2 file:text-foreground"
                  onChange={(e) => {
                    const selected = e.target.files?.[0] ?? null;
                    if (
                      selected &&
                      (selected.size > 5 * 1024 * 1024 ||
                        ![
                          "image/jpeg",
                          "image/png",
                          "image/webp",
                          "image/gif",
                        ].includes(selected.type))
                    ) {
                      setError(t("buyProductForm.fileError"));
                      e.target.value = "";
                      return;
                    }
                    setAttachment(selected);
                    uploadedUrl.current = null;
                    setError("");
                  }}
                />
                <div className="mt-4 flex min-h-36 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed bg-muted/20 p-6">
                  {preview ? (
                    <>
                      <img
                        src={preview}
                        alt={t("buyProductForm.attachment")}
                        className="max-h-72 max-w-full rounded-lg object-contain"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        className="mt-3"
                        onClick={() => {
                          setAttachment(null);
                          uploadedUrl.current = null;
                          if (fileInput.current) fileInput.current.value = "";
                        }}
                      >
                        <X className="size-4" />
                        {t("buyProductForm.remove")}
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className="mb-4 rounded-2xl bg-teal-500/10 p-5 text-teal-600">
                        <ImagePlus className="size-12" />
                      </span>
                      <p className="text-sm font-medium">
                        {t("buyProductForm.uploadHint")}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {t("buyProductForm.fileHint")}
                      </p>
                    </>
                  )}
                </div>
              </Card>
              <Card className="overflow-hidden rounded-2xl border bg-card">
                <h2 className="p-5 text-sm font-semibold">
                  {t("buyProductForm.summary")}
                </h2>
                <div className="overflow-x-auto">
                  <Table className="w-full text-start text-xs">
                    <TableHeader className="border-y bg-muted/40 text-muted-foreground">
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
                            className="whitespace-nowrap px-4 py-3 text-start font-medium"
                          >
                            {t(`buyProductForm.${key}`)}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody autoPaginate={false}>
                      {lines
                        .filter((line) => line.productId)
                        .map((line) => (
                          <TableRow key={line.id} className="border-b">
                            <TableCell className="px-4 py-3 font-medium">
                              {
                                options.data?.products.find(
                                  (p) => p.id === line.productId,
                                )?.name
                              }
                            </TableCell>
                            <TableCell className="px-4 py-3">
                              {options.data?.warehouses.find(
                                (w) => w.id === line.warehouseId,
                              )?.name ?? "—"}
                            </TableCell>
                            <TableCell className="px-4 py-3 tabular-nums">
                              {line.quantity}
                            </TableCell>
                            <TableCell className="px-4 py-3 tabular-nums">
                              {money(Number(line.price))}
                            </TableCell>
                            <TableCell className="px-4 py-3 tabular-nums">
                              {money(lineTotal(line))}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
                {!lines.some((line) => line.productId) && (
                  <p className="px-5 py-10 text-center text-sm text-muted-foreground">
                    {t("buyProductForm.empty")}
                  </p>
                )}
                <div className="flex justify-between gap-3 bg-teal-500/5 p-5 text-sm font-semibold">
                  <span>{t("buyProductForm.totalPrice")}</span>
                  <output className="text-lg tabular-nums text-teal-700 dark:text-teal-300">
                    {money(total)}
                  </output>
                </div>
              </Card>
            </div>
          </fieldset>
        </div>
      </ScrollArea>
      <div className="shrink-0 border-t bg-background px-6 py-4">
        {" "}
        <Button
          type="submit"
          disabled={saving || options.isLoading || !!options.error || !canBuy}
          className="h-11 w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <ShoppingCart className="size-4" />
          {t(saving ? "buyProductForm.saving" : "warehouseModule.buy")}
          <span className="ms-2 tabular-nums">{money(total)}</span>
        </Button>
      </div>
    </form>
  );
}

export default function BuyProductPage() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [revision, setRevision] = useState(0);
  const [saved, setSaved] = useState(false);
  const canBuy = hasPermission(storedUser(), "inventory.adjust");
  return (
    <div className="space-y-4">
      {saved && (
        <p role="status" className="rounded-lg bg-primary/10 p-3 text-primary">
          {t("buyProductForm.saved")}
        </p>
      )}
      <BuyHistoryPage
        key={revision}
        title="warehouseModule.buyProduct"
        headerAction={
          canBuy && (
            <Button
              className="ms-auto"
              onClick={() => {
                setSaved(false);
                setOpen(true);
              }}
            >
              <Plus className="size-4" />
              {t("buyProductForm.newPurchase")}
            </Button>
          )
        }
      />
      <Dialog
        open={open}
        onOpenChange={(value) => {
          if (!busy) setOpen(value);
        }}
      >
        <DialogContent
          dir={i18n.dir()}
          className="flex h-[90dvh] max-h-[90dvh] flex-col gap-0 overflow-hidden p-0 sm:max-w-[min(96vw,1200px)]"
        >
          <DialogHeader className="shrink-0 px-6 py-5">
            <DialogTitle>{t("buyProductForm.newPurchase")}</DialogTitle>
          </DialogHeader>
          <BuyProductForm
            onBusy={setBusy}
            onSaved={() => {
              setOpen(false);
              setSaved(true);
              setRevision((value) => value + 1);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
