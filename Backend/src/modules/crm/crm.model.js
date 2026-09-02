import { prisma } from "../../shared/database/client.js";

const models = {
  patients: "patient",
  surgeries: "surgery",
  "surgery-appointments": "surgeryAppointment",
  payments: "patientPayment",
};

const includes = {
  patients: undefined,
  surgeries: undefined,
  "surgery-appointments": {
    patient: true,
    doctor: { include: { employee: true } },
    surgery: true,
  },
  payments: {
    patient: true,
    surgeryAppointment: { include: { surgery: true } },
  },
};

const delegate = (resource) => prisma[models[resource]];
const includeFor = (resource) =>
  includes[resource] ? { include: includes[resource] } : {};

export const crmModel = {
  async lookups() {
    const [patients, doctors, surgeries, surgeryAppointments] =
      await Promise.all([
        prisma.patient.findMany({
          where: { status: "active" },
          orderBy: { firstName: "asc" },
        }),
        prisma.healthStaff.findMany({
          where: { staffType: "doctor", status: "active" },
          include: { employee: true },
          orderBy: { employee: { firstName: "asc" } },
        }),
        prisma.surgery.findMany({
          where: { status: "active" },
          orderBy: { name: "asc" },
        }),
        prisma.surgeryAppointment.findMany({
          include: { patient: true, surgery: true },
          orderBy: { scheduledAt: "desc" },
          take: 500,
        }),
      ]);
    return { patients, doctors, surgeries, surgeryAppointments };
  },
  list: (resource, skip, take) =>
    Promise.all([
      delegate(resource).findMany({
        ...includeFor(resource),
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      delegate(resource).count(),
    ]),
  create: (resource, data) =>
    delegate(resource).create({ data, ...includeFor(resource) }),
  update: (resource, id, data) =>
    delegate(resource).update({ where: { id }, data, ...includeFor(resource) }),
  delete: (resource, id) => delegate(resource).delete({ where: { id } }),
};
