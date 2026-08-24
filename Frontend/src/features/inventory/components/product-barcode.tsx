import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";
import type { RecordItem } from "../api/inventory.api";
import logo from "@/assets/icons/logo.png";

const isValidEan13 = (value: string) => {
  if (!/^\d{13}$/.test(value)) return false;
  const expected = value
    .slice(0, 12)
    .split("")
    .reduce(
      (sum, digit, index) => sum + Number(digit) * (index % 2 ? 3 : 1),
      0,
    );
  return Number(value[12]) === (10 - (expected % 10)) % 10;
};
const renderBarcode = (
  element: SVGSVGElement,
  value: string,
  options: Record<string, unknown>,
) => {
  try {
    JsBarcode(element, value, {
      ...options,
      format: isValidEan13(value) ? "EAN13" : "CODE128",
    });
  } catch {
    JsBarcode(element, value, { ...options, format: "CODE128" });
  }
};

export function ProductBarcode({ value }: { value: string }) {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (ref.current && value)
      renderBarcode(ref.current, value, {
        width: 2,
        height: 58,
        fontSize: 15,
        margin: 8,
      });
  }, [value]);
  return (
    <div className="flex w-full flex-col items-center">
      <div className="relative z-10 mb-1 flex items-center gap-1.5 rounded-full border bg-white px-2 py-1 shadow-sm">
        <img
          src={logo}
          alt="NHO"
          className="size-5 rounded-md object-contain"
        />
        <b className="text-[10px] tracking-[0.18em] text-slate-800">NHO</b>
      </div>
      <svg
        ref={ref}
        className="block h-auto max-h-28 max-w-full"
        aria-label={value}
      />
    </div>
  );
}

export function printProductBarcode(
  product: RecordItem,
  quantity: number,
  size: "50x30" | "40x25",
) {
  printProductBarcodes([product], quantity, size);
}

export function printProductBarcodes(
  products: RecordItem[],
  quantity: number,
  size: "50x30" | "40x25",
) {
  const printable = products.filter((product) => product.barcode);
  if (!printable.length) return;
  const [width, height] = size.split("x").map(Number);
  const labels = printable.flatMap((product) => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    renderBarcode(svg, String(product.barcode), {
      width: size === "40x25" ? 1.35 : 1.65,
      height: size === "40x25" ? 34 : 42,
      fontSize: size === "40x25" ? 10 : 12,
      margin: 2,
    });
    const label = `<article class="label"><header><img src="${logo}" alt="NHO"><b>NHO</b></header><div class="barcode">${svg.outerHTML}</div></article>`;
    return Array.from(
      { length: Math.max(1, Math.min(500, quantity)) },
      () => label,
    );
  });
  const popup = window.open("", "_blank", "width=700,height=700");
  if (!popup) return;
  popup.document.write(
    `<!doctype html><html><head><meta charset="utf-8"><title>Product barcodes</title><style>@page{size:${width}mm ${height}mm;margin:0}*{box-sizing:border-box}html,body{margin:0;padding:0}.label{width:${width}mm;height:${height}mm;padding:1.2mm 1.5mm;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;break-after:page;page-break-after:always}.label:last-child{break-after:auto;page-break-after:auto}.label header{position:relative;z-index:2;display:flex;align-items:center;gap:1mm;margin-bottom:-.5mm;padding:.4mm 1.5mm;border:1px solid #dbe3ec;border-radius:999px;background:#fff;box-shadow:0 .4mm 1.2mm #0f172a20}.label header img{width:${size === "40x25" ? 4 : 5}mm;height:${size === "40x25" ? 4 : 5}mm;border-radius:1mm;object-fit:contain}.label header b{font:700 ${size === "40x25" ? 7 : 8}px Arial,sans-serif;letter-spacing:.5mm;color:#07599a}.barcode{display:flex;width:100%;min-height:0;align-items:center;justify-content:center}.label svg{display:block;max-width:100%;height:auto}@media screen{body{background:#ddd}.label{margin:8px auto;background:white;box-shadow:0 2px 8px #0002}}</style></head><body>${labels.join("")}<script>setTimeout(()=>window.print(),300)<\/script></body></html>`,
  );
  popup.document.close();
}
