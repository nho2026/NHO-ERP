import { z } from "zod";
const nullableText = z.string().trim().nullable().optional(),
  currency = z.string().trim().length(3).default("IQD");
export const fundingSchema = z.object({
  sourceName: z.string().trim().min(2),
  fundingType: z.enum(["grant", "loan", "investment", "donation", "internal"]),
  committedAmount: z.coerce.number().positive(),
  receivedAmount: z.coerce.number().min(0).default(0),
  currency,
  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullable().optional(),
  interestRate: z.coerce.number().min(0).max(100).default(0),
  status: z
    .enum(["planned", "active", "completed", "cancelled"])
    .default("planned"),
  notes: nullableText,
});
