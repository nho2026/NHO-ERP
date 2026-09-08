import { z } from "zod";
export const purchaseSchema = z.object({
  requestId: z.string().uuid(),
  invoiceNumber: z.string().trim().min(1).max(100),
  buyDate: z.iso.date(),
  retailer: z.string().trim().min(1).max(150),
  salesperson: z.string().trim().max(150).default(""),
  isDebt: z.boolean().default(false),
  note: z.string().trim().max(5000).default(""),
  attachmentUrl: z
    .string()
    .regex(/^\/public\/product-images\/[a-zA-Z0-9.-]+$/)
    .nullable()
    .default(null),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        warehouseId: z.string().min(1),
        unit: z.string().trim().min(1).max(50).optional(),
        quantity: z.number().finite().positive().max(1000000),
        price: z
          .number()
          .finite()
          .min(0)
          .max(100000000)
          .refine(
            (n) => Math.abs(n * 100 - Math.round(n * 100)) < 0.000001,
            "Use at most two decimal places.",
          ),
      }),
    )
    .min(1)
    .max(100),
});

export const paymentSchema = z.object({
  requestId: z.string().uuid(),
  amount: z
    .number()
    .finite()
    .positive()
    .max(100000000)
    .refine(
      (n) => Math.abs(n * 100 - Math.round(n * 100)) < 0.000001,
      "Use at most two decimal places.",
    ),
  note: z.string().trim().max(5000).default(""),
});
export const debtStatusSchema = z.enum(["", "paid", "unpaid", "partial"]);
