import { z } from "zod";
export const employeeSchema = z.object({
  employeeCode: z.string().trim().min(1).max(32),
  userId: z.string().trim().nullable().optional(),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  departmentId: z.string().trim().nullable().optional(),
  positionId: z.string().trim().nullable().optional(),
  hireDate: z.coerce.date(),
  status: z.enum(["active", "inactive", "terminated"]).default("active"),
});
