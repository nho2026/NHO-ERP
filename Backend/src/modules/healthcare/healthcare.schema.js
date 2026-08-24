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
export const appointmentSchema = z.object({
  patientName: z.string().trim().min(2),
  patientPhone: z.string().trim().min(5),
  patientEmail: z
    .union([z.string().email(), z.literal(""), z.null()])
    .optional(),
  doctorId: z.string(),
  departmentId: z.string(),
  scheduledAt: z.coerce.date(),
  durationMinutes: z.coerce.number().int().min(10).max(480).default(30),
  reason: nullable,
  notes: nullable,
  status: z
    .enum(["pending", "confirmed", "completed", "cancelled", "no_show"])
    .default("pending"),
});
export const bookingSchema = appointmentSchema
  .pick({
    patientName: true,
    patientPhone: true,
    patientEmail: true,
    doctorId: true,
    departmentId: true,
    scheduledAt: true,
    reason: true,
  })
  .extend({
    scheduledAt: z.coerce
      .date()
      .refine(
        (value) => value > new Date(),
        "Appointment must be in the future.",
      ),
  });
