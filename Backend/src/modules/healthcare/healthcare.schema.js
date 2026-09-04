import { z } from "zod";
const nullable = z.string().trim().nullable().optional();
export const departmentSchema = z.object({
  code: z.string().trim().min(2).max(20),
  name: z.string().trim().min(2),
  description: nullable,
  managerId: z.string().nullable().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
});
export const staffSchema = z.object({
  employeeId: z.string(),
  departmentId: z.string().nullable().optional(),
  staffType: z.enum([
    "doctor",
    "nurse",
    "technician",
    "pharmacist",
    "therapist",
    "other",
  ]),
  specialization: nullable,
  licenseNumber: nullable,
  biography: nullable,
  publicBookingEnabled: z.boolean().default(false),
  status: z.enum(["active", "inactive"]).default("active"),
});
