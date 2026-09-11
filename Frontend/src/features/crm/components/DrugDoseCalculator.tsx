import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button";

export type DrugProduct = {
  id: string; name: string; sku: string; size: string | null;
  doseMgKgDay: number | null; dosesPerDay: number | null;
  concentrationMg: number | null; concentrationMl: number | null;
};
export function calculateDose(weight: number, product: DrugProduct) {
  const { doseMgKgDay, dosesPerDay, concentrationMg, concentrationMl } = product;
  if (![weight, doseMgKgDay, dosesPerDay, concentrationMg, concentrationMl].every(value => typeof value === "number" && Number.isFinite(value) && value > 0) || !Number.isInteger(dosesPerDay) || dosesPerDay! > 24) return null;
  const daily = weight * doseMgKgDay!;
  const perDose = daily / dosesPerDay!;
  const concentration = concentrationMg! / concentrationMl!;
  const ml = perDose / concentration;
  return [daily, perDose, concentration, ml].every(value => Number.isFinite(value) && value > 0) ? { daily, perDose, concentration, ml } : null;
}
export default function DrugDoseCalculator({ product, onApply }: { product: DrugProduct; onApply: (dosage: string, frequency: string) => void }) {
  const { t } = useTranslation();
  const [weight, setWeight] = useState("");
  const result = calculateDose(Number(weight), product);
  const fmt = (value: number) => Number(value.toPrecision(6)).toString();
  return <div className="space-y-2 rounded-lg border p-3">
    <p className="font-semibold">{t("drugDose.title")}</p>
    <Label className="grid gap-1">{t("drugDose.weight")}<Input type="number" min="0" step="any" value={weight} onChange={event => setWeight(event.target.value)} /></Label>
    {calculateDose(1, product) ? <>
      <p dir="ltr">{product.doseMgKgDay} mg/kg/day · {product.dosesPerDay} doses/day · {product.concentrationMg} mg/{product.concentrationMl} mL</p>
      {result && <div aria-live="polite" dir="ltr">
        <p>{fmt(result.daily)} mg/day → {fmt(result.perDose)} mg/dose</p>
        <p>{fmt(result.concentration)} mg/mL → <strong>{fmt(result.ml)} mL/dose</strong></p>
      </div>}
      <p className="text-xs text-muted-foreground">{t("drugDose.review")}</p>
      <Button type="button" variant="outline" disabled={!result} onClick={() => result && onApply(`${fmt(result.ml)} mL`, `${product.dosesPerDay} doses/day`)}>{t("drugDose.apply")}</Button>
    </> : <p className="text-sm text-muted-foreground">{t("drugDose.missing")}</p>}
  </div>;
}
