import { Label } from "@/shared/components/ui/label";
import { useCallback, useMemo, useState } from "react";
import {
  Barcode,
  Plus,
  Printer,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { inventoryApi } from "../api/inventory.api";
import {
  printProductBarcodes,
  ProductBarcode,
} from "../components/product-barcode";
import { useApiResource } from "@/shared/hooks/useApiResource";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { ResourceState } from "@/shared/components/ui/table-resource-state";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { DeleteConfirmationDialog } from "@/shared/components/ui/confirmation-dialog";

export default function BarcodeLabelsPage() {
  const { t } = useTranslation();
  const products = useApiResource(
    useCallback(() => inventoryApi.all("products"), []),
  );
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [quantity, setQuantity] = useState("1");
  const [size, setSize] = useState<"50x30" | "40x25">("50x30");
  const [adding, setAdding] = useState<string>();
  const [addOpen, setAddOpen] = useState(false);
  const [addProductId, setAddProductId] = useState("");
  const [generatedBarcode, setGeneratedBarcode] = useState("");
  const [preparing, setPreparing] = useState(false);
  const [deleting, setDeleting] = useState<string>();
  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (products.data ?? []).filter(
      (product) =>
        Boolean(product.barcode) &&
        (!term || String(product.barcode).toLowerCase().includes(term)),
    );
  }, [products.data, search]);
  const chosen = (products.data ?? []).filter((product) =>
    selected.has(product.id),
  );
  const missingProducts = (products.data ?? []).filter(
    (product) => !product.barcode,
  );
  const toggle = (id: string, checked: boolean) =>
    setSelected((current) => {
      const next = new Set(current);
      checked ? next.add(id) : next.delete(id);
      return next;
    });
  const openAddDialog = async (productId = "") => {
    setAddProductId(productId);
    setGeneratedBarcode("");
    setAddOpen(true);
    setPreparing(true);
    try {
      setGeneratedBarcode(await inventoryApi.newBarcode());
    } finally {
      setPreparing(false);
    }
  };
  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Barcode />
            {t("inventory.barcode.pageTitle")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("inventory.barcode.description")}
          </p>
        </div>
        <Button onClick={() => void openAddDialog()}>
          <Plus />
          {t("inventory.barcode.addNew")}
        </Button>
      </header>
      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 p-4">
          <div className="relative min-w-64 flex-1">
            <Search className="absolute inset-s-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="ps-9"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("inventory.barcode.search")}
            />
          </div>
          <Input
            className="w-32"
            type="number"
            min="1"
            max="500"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            placeholder={t("inventory.barcode.quantity")}
          />
          <Select
            value={size}
            onValueChange={(value) => setSize(value as "50x30" | "40x25")}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="50x30">50 × 30 mm</SelectItem>
              <SelectItem value="40x25">40 × 25 mm</SelectItem>
            </SelectContent>
          </Select>
          <Label className="flex h-10 cursor-pointer items-center gap-2 rounded-lg border bg-background px-3 text-sm font-medium shadow-sm hover:bg-muted">
            <Checkbox
              className="size-5 rounded-md"
              checked={
                rows.length > 0 && rows.every((row) => selected.has(row.id))
              }
              onCheckedChange={(checked) =>
                setSelected(
                  checked ? new Set(rows.map((row) => row.id)) : new Set(),
                )
              }
            />
            {t("inventory.barcode.selectAll")}
          </Label>
          <Button
            disabled={!chosen.length}
            onClick={() =>
              printProductBarcodes(chosen, Number(quantity) || 1, size)
            }
          >
            <Printer />
            {t("inventory.barcode.printSelected", { count: selected.size })}
          </Button>
        </CardContent>
      </Card>
      <ResourceState
        isLoading={products.isLoading}
        error={products.error}
        isEmpty={!rows.length}
      />
      {!products.isLoading && rows.length > 0 && (
        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {rows.map((product) => {
            const checked = selected.has(product.id);
            return (
              <Card
                key={product.id}
                className={`group min-w-0 overflow-hidden border bg-card transition-all duration-200 ${checked ? "border-primary ring-2 ring-primary/20" : "hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-lg"}`}
              >
                <CardContent className="relative flex min-w-0 flex-col gap-3 p-3">
                  <Label className="absolute end-5 top-5 z-10 grid size-9 shrink-0 cursor-pointer place-items-center rounded-xl border border-slate-200 bg-white/95 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900/95 dark:hover:bg-slate-800">
                    <Checkbox
                      className="size-5 rounded-md"
                      checked={checked}
                      onCheckedChange={(value) =>
                        toggle(product.id, Boolean(value))
                      }
                      aria-label={t("inventory.barcode.selectProduct")}
                    />
                  </Label>
                  <div className="flex h-36 w-full min-w-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-inner dark:border-slate-700">
                    <ProductBarcode value={String(product.barcode)} />
                  </div>
                  <div className="grid w-full grid-cols-2 gap-2">
                    {product.barcode && (
                      <DeleteConfirmationDialog
                        description={t("inventory.barcode.deleteConfirm")}
                        onConfirm={async () => {
                          setDeleting(product.id);
                          try {
                            await inventoryApi.removeBarcode(product.id);
                            setSelected((current) => {
                              const next = new Set(current);
                              next.delete(product.id);
                              return next;
                            });
                            await products.refresh();
                          } finally {
                            setDeleting(undefined);
                          }
                        }}
                      >
                        <Button
                          variant="outline"
                          className="h-10 border-destructive/25 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                          disabled={deleting === product.id}
                        >
                          <Trash2 />
                          {t("inventory.barcode.delete")}
                        </Button>
                      </DeleteConfirmationDialog>
                    )}
                    {product.barcode && (
                      <Button
                        className="h-10 text-xs"
                        disabled={deleting === product.id}
                        onClick={() =>
                          printProductBarcodes(
                            [product],
                            Number(quantity) || 1,
                            size,
                          )
                        }
                      >
                        <Printer />
                        {t("inventory.barcode.print")}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Barcode />
              {t("inventory.barcode.addNew")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex min-h-32 items-center justify-center rounded-xl border bg-white p-3">
              {preparing ? (
                <RefreshCw className="animate-spin text-primary" />
              ) : generatedBarcode ? (
                <ProductBarcode value={generatedBarcode} />
              ) : null}
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={preparing || Boolean(adding)}
              onClick={async () => {
                setPreparing(true);
                try {
                  setGeneratedBarcode(await inventoryApi.newBarcode());
                } finally {
                  setPreparing(false);
                }
              }}
            >
              <RefreshCw className={preparing ? "animate-spin" : ""} />
              {t("inventory.barcode.generate")}
            </Button>
            {missingProducts.length ? (
              <Select value={addProductId} onValueChange={setAddProductId}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("inventory.barcode.selectProduct")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {missingProducts.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} · {product.sku}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                {t("inventory.barcode.noMissing")}
              </div>
            )}
            <Button
              className="w-full"
              disabled={
                !addProductId ||
                !generatedBarcode ||
                Boolean(adding) ||
                preparing
              }
              onClick={async () => {
                setAdding(addProductId);
                try {
                  await inventoryApi.addBarcode(addProductId, generatedBarcode);
                  await products.refresh();
                  setAddOpen(false);
                } finally {
                  setAdding(undefined);
                }
              }}
            >
              <Plus />
              {t("inventory.barcode.confirmAdd")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
