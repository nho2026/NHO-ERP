import { z } from "zod";
export const employeeSchema = z.object({
  employeeCode: z.string().trim().min(1).max(32),
  userId: z.string().trim().nullable().optional(),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  departmentId: z.string().trim().nullable().optional(),
  positionId: z.string().trim().nullable().optional(),
  isTeamLeader: z.boolean().optional(),
  teamLeaderId: z.string().trim().nullable().optional(),
  hireDate: z.coerce.date(),
  checkInTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
    .default("09:00"),
  checkOutTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
    .default("17:00"),
  status: z.enum(["active", "inactive", "terminated"]).default("active"),
});
