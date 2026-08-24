import { z } from "zod";
const nullableText = z.string().trim().nullable().optional(),
  currency = z.string().trim().length(3).default("IQD");
export const cashFlowSchema = z.object({
  flowDate: z.coerce.date(),
  flowType: z.enum(["inflow", "outflow"]),
  category: z.string().trim().min(2),
  amount: z.coerce.number().positive(),
  currency,
  description: z.string().trim().min(2),
  status: z.enum(["planned", "confirmed", "cancelled"]).default("planned"),
});
