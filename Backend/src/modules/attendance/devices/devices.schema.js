import { z } from "zod";
export const deviceSchema = z.object({
  name: z.string().min(2),
  ipAddress: z.string().min(3),
  port: z.coerce.number().int().min(1).max(65535).default(80),
  username: z.string().min(1),
  password: z.string().optional(),
  workingDaysPerMonth: z.coerce.number().int().min(1).max(31).default(22),
  checkInTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
    .default("09:00"),
  checkOutTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
    .default("17:00"),
});
export const adminPasswordSchema = z.object({
  password: z.string().optional(),
});
