import { prisma } from "../../../shared/database/client.js";

const serviceInclude = { department: true, appointment: true };

export const advancesModel = {
  listSalary: () =>
    prisma.salaryAdvance.findMany({
      include: { employee: true },
      orderBy: { requestedAt: "desc" },
    }),
  findSalary: (id) => prisma.salaryAdvance.findUniqueOrThrow({ where: { id } }),
  createSalary: (data) =>
    prisma.salaryAdvance.create({ data, include: { employee: true } }),
  updateSalary: (id, data) =>
    prisma.salaryAdvance.update({
      where: { id },
      data,
      include: { employee: true },
    }),
  deleteSalary: (id) =>
    prisma.salaryAdvance.delete({
      where: { id, status: { in: ["requested", "rejected", "cancelled"] } },
    }),
  listService: () =>
    prisma.serviceAdvance.findMany({
      include: serviceInclude,
      orderBy: { receivedAt: "desc" },
    }),
  findService: (id) =>
    prisma.serviceAdvance.findUniqueOrThrow({ where: { id } }),
  createService: (data) =>
    prisma.serviceAdvance.create({ data, include: serviceInclude }),
  updateService: (id, data) =>
    prisma.serviceAdvance.update({
      where: { id },
      data,
      include: serviceInclude,
    }),
  deleteService: (id) =>
    prisma.serviceAdvance.delete({
      where: { id, status: { in: ["open", "cancelled"] }, appliedAmount: 0 },
    }),
};
