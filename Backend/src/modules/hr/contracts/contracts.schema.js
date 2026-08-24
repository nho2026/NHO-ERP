import { z } from "zod";
export const contractSchema = z.object({
  employeeId: z.string(),
  contractType: z.string().trim().min(1),
  startDate: z.coerce.date(),
  endDate: z.union([z.coerce.date(), z.null()]).optional(),
  status: z.enum(["active", "expired", "terminated"]).default("active"),
});
