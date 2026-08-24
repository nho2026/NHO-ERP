import { z } from "zod";
const nullableText = z.string().trim().nullable().optional(),
  currency = z.string().trim().length(3).default("IQD");
export const budgetSchema = z.object({
  name: z.string().trim().min(2),
  fiscalYear: z.coerce.number().int().min(2000).max(2200),
  department: nullableText,
  category: z.string().trim().min(2),
  plannedAmount: z.coerce.number().min(0),
  currency,
  status: z.enum(["draft", "approved", "closed"]).default("draft"),
  notes: nullableText,
});
