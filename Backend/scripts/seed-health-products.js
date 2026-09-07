import { writeFile } from "node:fs/promises";
import { prisma } from "../src/shared/database/client.js";

// Sample catalog prices only; no stock or supplier claims are seeded.
const groups = {
  "Protective Equipment": [
    ["Nitrile Examination Gloves — Small", "box", 5],
    ["Nitrile Examination Gloves — Medium", "box", 5],
    ["Nitrile Examination Gloves — Large", "box", 5],
    ["Surgical Face Masks", "box", 3],
    ["Disposable Isolation Gown", "item", 1.5],
    ["Disposable Surgical Cap", "pack", 3],
    ["Disposable Shoe Covers", "pack", 3],
    ["Protective Face Shield", "item", 2],
    ["Safety Goggles", "item", 4],
    ["Sterile Surgical Gloves — Size 7", "pair", 1],
  ],
  "Wound Care": [
    ["Sterile Gauze Swabs — 5 × 5 cm", "pack", 1],
    ["Sterile Gauze Swabs — 10 × 10 cm", "pack", 1.5],
    ["Adhesive Bandages — Assorted", "box", 2],
    ["Medical Adhesive Tape — 2.5 cm", "roll", 1],
    ["Elastic Bandage — 10 cm", "roll", 2],
    ["Cotton Wool — 500 g", "pack", 3],
    ["Non-adherent Dressing — 10 × 10 cm", "item", 1],
    ["Transparent Film Dressing — 6 × 7 cm", "item", 1.2],
    ["Wound Closure Strips", "pack", 2],
    ["Sterile Abdominal Pad — 10 × 20 cm", "item", 1.5],
  ],
  "Injection and Infusion Supplies": [
    ["Disposable Syringe — 2 mL", "item", 0.15],
    ["Disposable Syringe — 5 mL", "item", 0.2],
    ["Disposable Syringe — 10 mL", "item", 0.3],
    ["Disposable Syringe — 20 mL", "item", 0.5],
    ["Hypodermic Needle — 21G", "item", 0.08],
    ["Hypodermic Needle — 23G", "item", 0.08],
    ["Peripheral IV Cannula — 18G", "item", 0.6],
    ["Peripheral IV Cannula — 20G", "item", 0.6],
    ["IV Administration Set", "item", 0.8],
    ["Three-way Stopcock", "item", 0.5],
  ],
  "Diagnostic Equipment": [
    ["Digital Thermometer", "item", 3],
    ["Infrared Forehead Thermometer", "item", 15],
    ["Fingertip Pulse Oximeter", "item", 12],
    ["Aneroid Blood Pressure Monitor", "item", 18],
    ["Adult Blood Pressure Cuff", "item", 6],
    ["Pediatric Blood Pressure Cuff", "item", 6],
    ["Dual-head Stethoscope", "item", 10],
    ["Diagnostic Penlight", "item", 2],
    ["Disposable Tongue Depressors", "box", 2],
    ["ECG Electrodes", "pack", 4],
  ],
  "Patient Care Supplies": [
    ["Adult Nasal Oxygen Cannula", "item", 0.8],
    ["Adult Oxygen Mask", "item", 1.2],
    ["Adult Nebulizer Mask Kit", "item", 2],
    ["Urine Drainage Bag — 2 L", "item", 0.8],
    ["Sterile Specimen Container — 60 mL", "item", 0.25],
    ["Disposable Underpads — 60 × 90 cm", "pack", 4],
    ["Emesis Basin", "item", 1.5],
    ["Sharps Container — 5 L", "item", 3],
    ["Disposable Bed Sheet", "item", 1],
    ["Patient Identification Wristband", "item", 0.15],
  ],
};
try {
  const count = Object.values(groups).flat().length;
  if (count !== 50) throw new Error("Expected exactly 50 seed products.");
  if (!process.argv.includes("--apply")) {
    console.log(JSON.stringify({ count, categories: Object.keys(groups), policy: "Delete unreferenced old products; archive products with history. Prices are samples. No stock changes." }, null, 2));
  } else {
    const old = await prisma.inventoryProduct.findMany({ include: { stocks: true, images: true } });
    const backupDir = process.env.TMPDIR || "/tmp";
    const backup = `${backupDir}/health-product-backup-${Date.now()}.json`;
    await writeFile(backup, JSON.stringify(old, null, 2), { mode: 0o600 });
    const result = await prisma.$transaction(async tx => {
      let deleted = 0, archived = 0;
      for (const product of old) {
        if (/^health_seed_\d{3}$/.test(product.id)) continue;
        const [movements, sales] = await Promise.all([
          tx.inventoryMovement.count({ where: { productId: product.id } }),
          tx.posSaleItem.count({ where: { productId: product.id } }),
        ]);
        if (movements || sales || product.stocks.some(stock => stock.quantity !== 0)) {
          await tx.inventoryProduct.update({ where: { id: product.id }, data: { status: "inactive" } }); archived++;
        } else {
          await tx.inventoryProduct.delete({ where: { id: product.id } }); deleted++;
        }
      }
      let index = 0;
      for (const [name, products] of Object.entries(groups)) {
        let category = await tx.productCategory.findFirst({ where: { name } });
        if (!category) category = await tx.productCategory.create({ data: { name, status: "active" } });
        for (const [name, unit, costPrice] of products) {
          const code = String(++index).padStart(3, "0");
          const data = { name, unit, costPrice, sellingPrice: Math.round(costPrice * 1.25 * 100) / 100, categoryId: category.id, sku: `HEALTH-${code}`, status: "active", productType: "patient_use" };
          await tx.inventoryProduct.upsert({ where: { id: `health_seed_${code}` }, create: { id: `health_seed_${code}`, ...data }, update: data });
        }
      }
      return { deleted, archived, seeded: index, active: await tx.inventoryProduct.count({ where: { status: "active" } }) };
    }, { timeout: 60000 });
    console.log(JSON.stringify({ ...result, backup }));
  }
} finally { await prisma.$disconnect(); }
