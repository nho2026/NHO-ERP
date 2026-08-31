import { z } from "zod";
const optionalDate = z.preprocess(
  (v) => (v === "" || v == null ? null : v),
  z.coerce.date().nullable().optional(),
);
export const taskSchema = z
  .object({
    title: z.string().trim().min(2).max(200),
    description: z.string().trim().min(2).max(10000),
    team: z
      .enum([
        "marketing",
        "design",
        "content",
        "development",
        "photography",
        "other",
      ])
      .nullable()
      .optional(),
    priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
    status: z
      .enum(["todo", "in_progress", "review", "completed", "cancelled"])
      .default("todo"),
    startDate: optionalDate,
    dueDate: optionalDate,
    estimatedMinutes: z.coerce.number().int().min(0).nullable().optional(),
    assigneeIds: z.array(z.string()).min(1),
    attachments: z
      .array(
        z.object({
          fileName: z.string(),
          fileUrl: z.string().startsWith("/public/task-attachments/"),
          mimeType: z.string(),
          fileSize: z.coerce.number().int().nonnegative(),
        }),
      )
      .max(10)
      .default([]),
  })
  .refine((v) => !v.startDate || !v.dueDate || v.dueDate >= v.startDate, {
    message: "Due date must be after the start date.",
  });
export const updateTaskSchema = z.object({
  title: z.string().trim().min(2).max(200).optional(),
  description: z.string().trim().min(2).max(10000).optional(),
  team: z
    .enum([
      "marketing",
      "design",
      "content",
      "development",
      "photography",
      "other",
    ])
    .nullable()
    .optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  status: z
    .enum(["todo", "in_progress", "review", "completed", "cancelled"])
    .optional(),
  startDate: optionalDate,
  dueDate: optionalDate,
  estimatedMinutes: z.coerce.number().int().min(0).nullable().optional(),
  assigneeIds: z.array(z.string()).min(1).optional(),
  reviewNote: z.string().trim().max(5000).nullable().optional(),
});
export const commentSchema = z.object({
  body: z.string().trim().min(1).max(5000),
});
export const timeEntrySchema = z.object({
  employeeId: z.string(),
  workDate: z.coerce.date(),
  minutes: z.coerce.number().int().min(1).max(1440),
  note: z.string().trim().max(2000).nullable().optional(),
});
export const monthlyReportSchema = z.object({
  month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/),
});
