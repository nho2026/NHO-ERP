import { prisma } from "../src/shared/database/client.js";

const categories = [
  "Protective Equipment", "Wound Care", "Injection and Infusion Supplies",
  "Diagnostic Equipment", "Patient Care Supplies", "Surgical Instruments",
  "Sutures and Wound Closure", "Respiratory Care", "Anesthesia Supplies",
  "Laboratory Supplies", "Specimen Collection", "Sterilization Supplies",
  "Disinfection and Hygiene", "Urology Supplies", "Enteral Feeding Supplies",
  "Orthopedic Supports", "Rehabilitation Equipment", "Hospital Furniture",
  "Patient Monitoring", "Emergency and Resuscitation", "Dental Supplies",
  "Ophthalmic Supplies", "Maternity and Neonatal Care", "Medical Waste Disposal",
  "Medical Imaging Accessories",
];
const brands = [
  "BD", "B. Braun", "Baxter", "Medtronic", "Terumo", "Fresenius Kabi",
  "Fresenius Medical Care", "Abbott", "Roche", "Siemens Healthineers",
  "GE HealthCare", "Philips", "Dräger", "Mindray", "Nihon Kohden",
  "OMRON", "Welch Allyn", "Stryker", "Zimmer Biomet", "Smith+Nephew",
  "Mölnlycke", "HARTMANN", "Coloplast", "ConvaTec", "Hollister",
  "Teleflex", "Ambu", "Littmann", "Ethicon", "Olympus",
];

const categoryDescriptions = [
  "Personal protective items including gloves, masks, gowns and eye protection.",
  "Dressings, gauze, bandages and supplies for wound care.",
  "Syringes, needles, IV cannulas, tubing and infusion accessories.",
  "Instruments and devices used for clinical examination and measurement.",
  "Everyday consumables and accessories for bedside patient care.",
  "Reusable and disposable instruments used in surgical procedures.",
  "Sutures, staples, closure strips and related wound-closure supplies.",
  "Oxygen delivery, nebulization and respiratory support accessories.",
  "Airway management and breathing-circuit supplies for anesthesia services.",
  "Laboratory consumables, containers and general testing accessories.",
  "Containers, collection tubes and accessories for clinical specimens.",
  "Packaging, indicators and accessories for sterilization workflows.",
  "Cleaning, hand hygiene and surface disinfection supplies.",
  "Urinary catheters, drainage bags and urological care accessories.",
  "Feeding tubes, administration sets and enteral feeding accessories.",
  "Braces, splints and supports for orthopedic care.",
  "Mobility aids and equipment for physical rehabilitation.",
  "Beds, examination couches, trolleys and clinical furnishings.",
  "Patient monitors, sensors, electrodes and monitoring accessories.",
  "Equipment and consumables for emergency response and resuscitation.",
  "Instruments, consumables and accessories for dental services.",
  "Supplies and accessories for eye examination and ophthalmic care.",
  "Clinical supplies for maternity services and newborn care.",
  "Sharps containers, clinical waste bags and disposal accessories.",
  "Accessories and consumables for medical imaging departments.",
];
const brandDescriptions = [
  "Medical technology brand associated with injection, infusion and specimen collection products.",
  "Healthcare brand associated with infusion therapy, surgical instruments and clinical supplies.",
  "Healthcare brand associated with hospital therapies and infusion products.",
  "Medical technology brand associated with surgical devices and patient therapies.",
  "Medical device brand associated with injection, infusion and cardiovascular products.",
  "Healthcare brand associated with infusion therapy and clinical nutrition.",
  "Healthcare brand associated with dialysis equipment and kidney care products.",
  "Healthcare brand associated with diagnostics, medical devices and nutrition products.",
  "Healthcare brand associated with laboratory diagnostics and pharmaceutical products.",
  "Medical technology brand associated with imaging and laboratory diagnostics.",
  "Medical technology brand associated with imaging, ultrasound and patient monitoring.",
  "Healthcare technology brand associated with imaging and patient monitoring equipment.",
  "Medical technology brand associated with ventilation, anesthesia and patient monitoring.",
  "Medical equipment brand associated with monitoring, ultrasound and laboratory diagnostics.",
  "Medical electronics brand associated with patient monitoring and diagnostic equipment.",
  "Healthcare brand associated with blood pressure monitors and personal health devices.",
  "Medical equipment brand associated with clinical examination and vital-sign measurement.",
  "Medical technology brand associated with surgical and orthopedic equipment.",
  "Medical technology brand associated with orthopedic implants and surgical instruments.",
  "Medical technology brand associated with orthopedics, sports medicine and wound management.",
  "Medical products brand associated with wound care and surgical supplies.",
  "Healthcare products brand associated with wound care, hygiene and incontinence care.",
  "Medical products brand associated with ostomy, continence and wound care.",
  "Medical products brand associated with wound, ostomy and continence care.",
  "Medical products brand associated with ostomy and continence care.",
  "Medical device brand associated with vascular access and airway management products.",
  "Medical device brand associated with resuscitation and single-use endoscopy products.",
  "Stethoscope brand used for clinical auscultation.",
  "Surgical products brand associated with sutures and wound-closure devices.",
  "Medical equipment brand associated with endoscopy and surgical visualization.",
];
const descriptions = new Map([
  ...categories.map((name, index) => [name, categoryDescriptions[index]]),
  ...brands.map((name, index) => [name, brandDescriptions[index]]),
]);

try {
  if (categories.length !== categoryDescriptions.length || brands.length !== brandDescriptions.length) throw new Error("Every seed entry needs a description.");
  for (const list of [categories, brands]) {
    if (new Set(list.map(name => name.toLowerCase())).size !== list.length) throw new Error("Duplicate seed name.");
  }
  if (!process.argv.includes("--apply")) {
    console.log(JSON.stringify({ categories, brands }, null, 2));
  } else {
    const result = await prisma.$transaction(async tx => {
      let categoriesCreated = 0, brandsCreated = 0, descriptionsUpdated = 0;
      for (const [model, names] of [[tx.productCategory, categories], [tx.productBrand, brands]]) {
        for (const name of names) {
          const existing = await model.findUnique({ where: { name } });
          if (!existing) {
            await model.create({ data: { name, description: descriptions.get(name), status: "active" } });
            if (model === tx.productCategory) categoriesCreated++; else brandsCreated++;
          } else {
            await model.update({ where: { id: existing.id }, data: { description: descriptions.get(name) } });
            descriptionsUpdated++;
          }
        }
      }
      // Keep old foreign keys intact while hiding obvious demonstration entries.
      const oldCategories = await tx.productCategory.updateMany({ where: { name: { startsWith: "Seed Category " } }, data: { status: "inactive" } });
      const oldBrands = await tx.productBrand.updateMany({ where: { name: { startsWith: "Seed Brand " } }, data: { status: "inactive" } });
      return {
        categoriesCreated, brandsCreated, descriptionsUpdated,
        placeholderCategoriesArchived: oldCategories.count,
        placeholderBrandsArchived: oldBrands.count,
        activeCategories: await tx.productCategory.count({ where: { status: "active" } }),
        activeBrands: await tx.productBrand.count({ where: { status: "active" } }),
      };
    }, { timeout: 60000 });
    console.log(JSON.stringify(result));
  }
} finally { await prisma.$disconnect(); }
