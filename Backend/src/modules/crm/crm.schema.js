import { z } from "zod";

const nullable = z.string().trim().nullable().optional();

export const crmSchemas = {
  patients: z.object({
    patientCode: z.string().trim().min(2),
    firstName: z.string().trim().min(2),
    lastName: z.string().trim().min(2),
    phone: z.string().trim().min(5),
    email: nullable,
    dateOfBirth: z.coerce.date().nullable().optional(),
    gender: nullable,
    address: nullable,
    bloodType: nullable,
    weightKg: z.coerce.number().positive().max(500).nullable().optional(),
    heightCm: z.coerce.number().positive().max(300).nullable().optional(),
    isMarried: z.boolean().default(false),
    childrenCount: z.coerce.number().int().min(0).default(0),
    hasDiabetes: z.boolean().default(false),
    hasHypertension: z.boolean().default(false),
    allergies: nullable,
    medicalNotes: nullable,
    status: z.enum(["active", "inactive"]).default("active"),
  }),
  surgeries: z.object({
    code: z.string().trim().min(2),
    name: z.string().trim().min(2),
    description: nullable,
    durationMinutes: z.coerce.number().int().min(10),
    basePrice: z.coerce.number().nonnegative(),
    status: z.enum(["active", "inactive"]).default("active"),
  }),
  "surgery-appointments": z.object({
    patientId: z.string(),
    doctorId: z.string(),
    surgeryId: z.string(),
    scheduledAt: z.coerce.date(),
    operatingRoom: nullable,
    status: z
      .enum(["scheduled", "confirmed", "in_progress", "completed", "cancelled"])
      .default("scheduled"),
    preOpNotes: nullable,
    postOpNotes: nullable,
  }),
  payments: z.object({
    patientId: z.string(),
    surgeryAppointmentId: z.string().nullable().optional(),
    amount: z.coerce.number().positive(),
    paymentMethod: z.enum(["cash", "card", "bank_transfer", "insurance"]),
    reference: nullable,
    notes: nullable,
    paidAt: z.coerce.date(),
    status: z
      .enum(["paid", "pending", "refunded", "cancelled"])
      .default("paid"),
  }),
};

export const isCrmResource = (resource) => Boolean(crmSchemas[resource]);
