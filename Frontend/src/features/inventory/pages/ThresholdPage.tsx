import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pencil } from "lucide-react";
import { apiClient, apiErrorMessage } from "@/shared/api/client";
import { hasPermission, storedUser } from "@/features/auth/access";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { SearchableFilter } from "@/shared/components/ui/searchable-filter";
import { Card } from "@/shared/components/ui/card";
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
} from "@/shared/components/ui/dialog";
const fields = [
  "anesthesiaMinimum",
  "scrubNurseMinimum",
  "perfusionMinimum",
  "cardiologyMinimum",
  "reorderLevel",
] as const;
type Stock = Record<(typeof fields)[number], number> & {
  id: string;
  quantity: number;
  warehouse: { id: string; name: string };
  product: {
    name: string;
    size?: string;
    sku: string;
    category?: { id: string; name: string };
  };
};
export default function ThresholdPage() {
  const { t, i18n } = useTranslation();
  const [rows, setRows] = useState<Stock[]>([]),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(""),
    [warehouse, setWarehouse] = useState("all"),
    [category, setCategory] = useState("all"),
    [only, setOnly] = useState(false);
  const [selected, setSelected] = useState<Stock | null>(null),
    [busy, setBusy] = useState(false),
    [version, setVersion] = useState(0);
  useEffect(() => {
    const c = new AbortController();
    setLoading(true);
    apiClient
      .get<Stock[]>("/inventory/thresholds", { signal: c.signal })
      .then((r) => setRows(r.data))
      .catch((e) => {
        if (!c.signal.aborted) setError(apiErrorMessage(e));
      })
      .finally(() => {
        if (!c.signal.aborted) setLoading(false);
      });
    return () => c.abort();
  }, [version]);
  const low = (row: Stock) => row.quantity <= row.reorderLevel;
  const filtered = rows.filter(
    (row) =>
      (warehouse === "all" || row.warehouse.id === warehouse) &&
      (category === "all" || row.product.category?.id === category) &&
      (!only || low(row)) &&
      [row.product.name, row.product.sku, row.product.size].some((v) =>
        v?.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
      ),
  );
  const options = (kind: "warehouse" | "category") => [
    { value: "all", label: t(`thresholds.all${kind}`) },
    ...Array.from(
      new Map(
        rows.flatMap((row) => {
          const item =
            kind === "warehouse" ? row.warehouse : row.product.category;
          return item
            ? [[item.id, { value: item.id, label: item.name }] as const]
            : [];
        }),
      ).values(),
    ),
  ];
  return (
    <div className="space-y-4" dir={i18n.dir()}>
      <h1 className="text-xl font-bold">{t("warehouseModule.threshold")}</h1>
      {error && !selected && (
        <p role="alert" className="text-destructive">
          {error}
        </p>
      )}
      <Card className="p-4">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Input
            className="max-w-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("thresholds.search")}
            aria-label={t("thresholds.search")}
          />
          <SearchableFilter
            value={warehouse}
            onValueChange={setWarehouse}
            options={options("warehouse")}
            label={t("thresholds.allwarehouse")}
          />
          <SearchableFilter
            value={category}
            onValueChange={setCategory}
            options={options("category")}
            label={t("thresholds.allcategory")}
          />
          <Label className="flex items-center gap-2">
            <Checkbox
              checked={only}
              onCheckedChange={(v) => setOnly(v === true)}
            />
            {t("thresholds.only")}
          </Label>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              {[
                "name",
                "size",
                "code",
                "category",
                "storage",
                "quantity",
                ...fields,
                "actions",
              ].map((k) => (
                <TableHead key={k}>{t(`thresholds.${k}`)}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={12} className="h-24 text-center">
                  {t("resourceState.loading")}
                </TableCell>
              </TableRow>
            ) : filtered.length ? (
              filtered.map((row) => (
                <TableRow
                  key={row.id}
                  className={
                    low(row) ? "bg-red-500/10 hover:bg-red-500/15" : ""
                  }
                >
                  <TableCell>{row.product.name}</TableCell>
                  <TableCell>{row.product.size || "—"}</TableCell>
                  <TableCell>{row.product.sku}</TableCell>
                  <TableCell>{row.product.category?.name || "—"}</TableCell>
                  <TableCell>{row.warehouse.name}</TableCell>
                  <TableCell
                    className={
                      low(row) ? "font-bold text-red-600 dark:text-red-300" : ""
                    }
                  >
                    {row.quantity}
                  </TableCell>
                  {fields.map((k) => (
                    <TableCell key={k}>{row[k]}</TableCell>
                  ))}
                  <TableCell>
                    <div className="flex flex-wrap items-center gap-2">
                      {hasPermission(storedUser(), "inventory.manage") && (
                        <Button data-action="edit"
                          variant="outline"
                          size="icon"
                          aria-label={t("thresholds.edit")}
                          onClick={() => {
                            setError("");
                            setSelected({ ...row });
                          }}
                        >
                          <Pencil />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={12}
                  className="h-24 text-center text-muted-foreground"
                >
                  {t("resourceState.notFound")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
      <Dialog
        open={!!selected}
        onOpenChange={(v) => {
          if (!v && !busy) setSelected(null);
        }}
      >
        <DialogContent
          dir={i18n.dir()}
          className="max-h-[90dvh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle>{t("thresholds.edit")}</DialogTitle>
          </DialogHeader>
          {selected && (
            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                if (busy) return;
                setBusy(true);
                setError("");
                try {
                  await apiClient.patch(
                    `/inventory/thresholds/${selected.id}`,
                    Object.fromEntries(
                      fields.map((k) => [k, Number(selected[k])]),
                    ),
                  );
                  setSelected(null);
                  setVersion((v) => v + 1);
                } catch (e) {
                  setError(apiErrorMessage(e));
                } finally {
                  setBusy(false);
                }
              }}
            >
              <p>
                {selected.product.name} · {selected.warehouse.name}
              </p>
              {fields.map((k) => (
                <div key={k} className="space-y-2">
                  <Label htmlFor={k}>{t(`thresholds.${k}`)}</Label>
                  <Input
                    id={k}
                    type="number"
                    min="0"
                    max="1000000000"
                    step="any"
                    required
                    disabled={busy}
                    value={selected[k]}
                    onChange={(e) =>
                      setSelected({ ...selected, [k]: Number(e.target.value) })
                    }
                  />
                </div>
              ))}
              {error && (
                <p role="alert" className="text-destructive">
                  {error}
                </p>
              )}
              <Button disabled={busy}>{t("retailers.save")}</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
