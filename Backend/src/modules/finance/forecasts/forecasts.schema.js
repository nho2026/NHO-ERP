import { z } from "zod";
const nullableText = z.string().trim().nullable().optional(),
  currency = z.string().trim().length(3).default("IQD");
const baseForecastSchema = z.object({
  name: z.string().trim().min(2),
  scenario: z.enum(["base", "optimistic", "conservative"]).default("base"),
  periodStart: z.coerce.date(),
  periodEnd: z.coerce.date(),
  projectedRevenue: z.coerce.number().min(0),
  projectedExpense: z.coerce.number().min(0),
  currency,
  status: z.enum(["draft", "approved", "archived"]).default("draft"),
  notes: nullableText,
});
export const forecastSchema = baseForecastSchema.refine(
  (v) => v.periodEnd >= v.periodStart,
  { message: "Forecast end date must be after its start date." },
);
export const updateForecastSchema = baseForecastSchema
  .partial()
  .refine(
    (v) => !v.periodStart || !v.periodEnd || v.periodEnd >= v.periodStart,
    { message: "Forecast end date must be after its start date." },
  );
