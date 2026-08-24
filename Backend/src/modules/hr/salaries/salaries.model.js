import { prisma } from "../../../shared/database/client.js";
export const salaryModel = {
  findAll: (query = {}) =>
    prisma.employeeSalary.findMany({
      include: { employee: true, contract: true },
      orderBy: { effectiveFrom: "desc" },
    }),
  create: (data) =>
    prisma.employeeSalary.create({
      data,
      include: { employee: true, contract: true },
    }),
  update: (id, data) =>
    prisma.employeeSalary.update({
      where: { id },
      data,
      include: { employee: true, contract: true },
    }),
  remove: (id) => prisma.employeeSalary.delete({ where: { id } }),
};
