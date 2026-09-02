import { z } from "zod";

const leadStatus = z.enum([
  "new",
  "contacted",
  "qualified",
  "converted",
  "appointment_requested",
  "lost",
]);

export const leadSchema = z.object({
  code: z.string().trim().min(1).max(50),
  name: z.string().trim().min(2).max(191),
  phone: z.string().trim().min(5).max(50),
  source: z.string().trim().min(2).max(100),
  age: z.coerce.number().int().min(0).max(150).nullable().optional(),
  gender: z.enum(["male", "female", "other"]).nullable().optional(),
  address: z.string().trim().max(500).nullable().optional(),
  email: z.string().trim().email().nullable().optional(),
  interest: z.string().trim().nullable().optional(),
  notes: z.string().trim().nullable().optional(),
  status: leadStatus.default("new"),
});

export const leadUpdateSchema = leadSchema.partial().extend({
  status: leadStatus.optional(),
});

export const leadFilterSchema = z.object({
  search: z.string().trim().max(191).optional(),
  source: z.string().trim().max(100).optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  status: leadStatus.optional(),
  minAge: z.coerce.number().int().min(0).max(150).optional(),
  maxAge: z.coerce.number().int().min(0).max(150).optional(),
});
