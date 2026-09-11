import { z } from 'zod';
export const prescriptionSchema = z.object({
  requestId: z.uuid(),
  notes: z.string().trim().max(4000).default(''),
  items: z.array(z.object({
    medicine: z.string().trim().min(1).max(200),
    dosage: z.string().trim().min(1).max(200),
    frequency: z.string().trim().min(1).max(200),
    duration: z.string().trim().min(1).max(200),
    quantity: z.number().int().positive().max(100000),
    instructions: z.string().trim().max(1000).default(''),
  })).min(1).max(50),
});
