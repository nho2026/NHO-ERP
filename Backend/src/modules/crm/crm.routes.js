import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../shared/database/client.js";
import { requireAuth } from "../../shared/middleware/auth.middleware.js";
import { validate } from "../../shared/middleware/validation.middleware.js";
import { pageResult, paginationArgs } from "../../shared/pagination/pagination.js";

const nullable = z.string().trim().nullable().optional();
const schemas = {
  leads: z.object({ name: z.string().trim().min(2), phone: z.string().trim().min(5), email: nullable, source: nullable, interest: nullable, notes: nullable, status: z.enum(["new", "contacted", "qualified", "converted", "appointment_requested", "lost"]).default("new") }),
  patients: z.object({ patientCode: z.string().trim().min(2), firstName: z.string().trim().min(2), lastName: z.string().trim().min(2), phone: z.string().trim().min(5), email: nullable, dateOfBirth: z.coerce.date().nullable().optional(), gender: nullable, address: nullable, bloodType: nullable, allergies: nullable, medicalNotes: nullable, status: z.enum(["active", "inactive"]).default("active") }),
  surgeries: z.object({ code: z.string().trim().min(2), name: z.string().trim().min(2), description: nullable, durationMinutes: z.coerce.number().int().min(10), basePrice: z.coerce.number().nonnegative(), status: z.enum(["active", "inactive"]).default("active") }),
  "surgery-appointments": z.object({ patientId: z.string(), doctorId: z.string(), surgeryId: z.string(), scheduledAt: z.coerce.date(), operatingRoom: nullable, status: z.enum(["scheduled", "confirmed", "in_progress", "completed", "cancelled"]).default("scheduled"), preOpNotes: nullable, postOpNotes: nullable }),
  payments: z.object({ patientId: z.string(), surgeryAppointmentId: z.string().nullable().optional(), amount: z.coerce.number().positive(), paymentMethod: z.enum(["cash", "card", "bank_transfer", "insurance"]), reference: nullable, notes: nullable, paidAt: z.coerce.date(), status: z.enum(["paid", "pending", "refunded", "cancelled"]).default("paid") }),
};
const models = { leads: "crmLead", patients: "patient", surgeries: "surgery", "surgery-appointments": "surgeryAppointment", payments: "patientPayment" };
const includes = {
  leads: { convertedPatient: true },
  patients: undefined,
  surgeries: undefined,
  "surgery-appointments": { patient: true, doctor: { include: { employee: true } }, surgery: true },
  payments: { patient: true, surgeryAppointment: { include: { surgery: true } } },
};
const router = Router();
router.use(requireAuth);
const run = (fn) => (req, res, next) => Promise.resolve(fn(req, res)).catch(next);
const canView = (req) => req.permissionKeys.has("*") || req.permissionKeys.has("employees.view") || req.permissionKeys.has("employees.manage");
const canManage = (req) => req.permissionKeys.has("*") || req.permissionKeys.has("employees.manage");
router.param("resource", (req, res, next, value) => models[value] ? next() : res.status(404).json({ message: "CRM resource not found." }));
router.get("/lookups", run(async (req, res) => {
  if (!canView(req)) return res.status(403).json({ message: "CRM access is required." });
  const [patients, doctors, surgeries, surgeryAppointments] = await Promise.all([
    prisma.patient.findMany({ where: { status: "active" }, orderBy: { firstName: "asc" } }),
    prisma.healthStaff.findMany({ where: { staffType: "doctor", status: "active" }, include: { employee: true }, orderBy: { employee: { firstName: "asc" } } }),
    prisma.surgery.findMany({ where: { status: "active" }, orderBy: { name: "asc" } }),
    prisma.surgeryAppointment.findMany({ include: { patient: true, surgery: true }, orderBy: { scheduledAt: "desc" }, take: 500 }),
  ]);
  res.json({ patients, doctors, surgeries, surgeryAppointments });
}));
router.get("/:resource", run(async (req, res) => {
  if (!canView(req)) return res.status(403).json({ message: "CRM access is required." });
  const resource = req.params.resource, model = prisma[models[resource]];
  const { page, pageSize, skip, take } = paginationArgs(req.query);
  const [items, total] = await Promise.all([
    model.findMany({ ...(includes[resource] && { include: includes[resource] }), orderBy: { createdAt: "desc" }, skip, take }),
    model.count(),
  ]);
  res.json(pageResult(items, total, page, pageSize));
}));
router.post("/:resource", (req, res, next) => canManage(req) ? next() : res.status(403).json({ message: "CRM management access is required." }), (req, res, next) => validate(schemas[req.params.resource])(req, res, next), run(async (req, res) => {
  const resource = req.params.resource, model = prisma[models[resource]];
  res.status(201).json(await model.create({ data: req.validatedBody, ...(includes[resource] && { include: includes[resource] }) }));
}));
router.patch("/:resource/:id", (req, res, next) => canManage(req) ? next() : res.status(403).json({ message: "CRM management access is required." }), (req, res, next) => validate(schemas[req.params.resource].partial())(req, res, next), run(async (req, res) => {
  const resource = req.params.resource, model = prisma[models[resource]];
  if (resource === "leads" && req.validatedBody.status === "converted") {
    const lead = await prisma.crmLead.findUniqueOrThrow({ where: { id: req.params.id }, include: { convertedPatient: true } });
    if (lead.convertedPatient)
      return res.json(await prisma.crmLead.update({ where: { id: lead.id }, data: req.validatedBody, include: { convertedPatient: true } }));
    const parts = lead.name.trim().split(/\s+/);
    const firstName = parts.shift() || lead.name;
    const lastName = parts.join(" ") || "Patient";
    return res.json(await prisma.$transaction(async (tx) => {
      const patient = await tx.patient.create({
        data: {
          patientCode: `LEAD-${lead.id.replace(/[^a-z0-9]/gi, "").slice(-10).toUpperCase()}`,
          firstName,
          lastName,
          phone: lead.phone,
          email: lead.email,
          medicalNotes: lead.notes ? `Converted from CRM lead. ${lead.notes}` : "Converted from CRM lead.",
          status: "active",
        },
      });
      return tx.crmLead.update({ where: { id: lead.id }, data: { ...req.validatedBody, convertedPatientId: patient.id }, include: { convertedPatient: true } });
    }));
  }
  res.json(await model.update({ where: { id: req.params.id }, data: req.validatedBody, ...(includes[resource] && { include: includes[resource] }) }));
}));
router.delete("/:resource/:id", run(async (req, res) => {
  if (!canManage(req)) return res.status(403).json({ message: "CRM management access is required." });
  await prisma[models[req.params.resource]].delete({ where: { id: req.params.id } }); res.status(204).end();
}));
export default router;
