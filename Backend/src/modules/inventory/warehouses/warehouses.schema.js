import { z } from "zod";
export const warehouseSchema = z.object({
  code: z.string().trim().min(1),
  name: z.string().trim().min(2),
  location: z.string().trim().nullable().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
});
