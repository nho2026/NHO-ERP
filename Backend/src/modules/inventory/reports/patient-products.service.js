import { patientProductsModel } from "./patient-products.model.js";
export function patientProductRows(cases) {
  return cases.flatMap((record) =>
    (Array.isArray(record.items) ? record.items : []).flatMap((item, index) => {
      if (!item || typeof item !== "object") return [];
      const number = (value) =>
        Number.isFinite(Number(value)) ? Number(value) : 0;
      const quantity = number(item.quantity);
      const cost = quantity * number(item.cost);
      const price = quantity * number(item.price);
      return [
        {
          id: `${record.id}:${index}`,
          patientName: record.patientName,
          patientCode: record.patient?.patientCode ?? record.patientId ?? "",
          department: record.unit,
          departmentType: item.part ?? "",
          date: record.entry.toISOString(),
          product: String(item.name ?? ""),
          size: String(item.size ?? ""),
          code: String(item.code ?? ""),
          barcode: String(item.barcode ?? ""),
          quantity,
          cost,
          price,
          profit: price - cost,
        },
      ];
    }),
  );
}

export const patientProductsService = {
  list: async () => patientProductRows(await patientProductsModel.listCases()),
};
