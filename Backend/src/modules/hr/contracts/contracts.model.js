import { prisma } from "../../../shared/database/client.js";
export const contractModel = {
  findAll: (query = {}) =>
    prisma.employeeContract.findMany({
      include: { employee: true },
      orderBy: { startDate: "desc" },
    }),
  create: (data) =>
    prisma.employeeContract.create({ data, include: { employee: true } }),
  update: (id, data) =>
    prisma.employeeContract.update({
      where: { id },
      data,
      include: { employee: true },
    }),
  remove: (id) => prisma.employeeContract.delete({ where: { id } }),
};
