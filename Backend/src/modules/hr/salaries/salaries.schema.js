import { z } from "zod";
export const salarySchema = z.object({
  employeeId: z.string(),
  baseSalary: z.coerce.number().nonnegative(),
  currencyId: z.string().trim().min(1),
  payType: z.string().trim().min(1),
  effectiveFrom: z.coerce.date(),
  effectiveTo: z.union([z.coerce.date(), z.null()]).optional(),
});
