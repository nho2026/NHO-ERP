import { prisma } from "../../../shared/database/client.js";
export const positionModel = {
  findAll: (query = {}) =>
    prisma.position.findMany({
      include: { _count: { select: { employees: true } } },
      orderBy: { name: "asc" },
    }),
  create: (data) =>
    prisma.position.create({
      data,
      include: { _count: { select: { employees: true } } },
    }),
  update: (id, data) =>
    prisma.position.update({
      where: { id },
      data,
      include: { _count: { select: { employees: true } } },
    }),
  remove: (id) => prisma.position.delete({ where: { id } }),
};
