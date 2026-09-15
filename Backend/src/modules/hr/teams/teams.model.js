import { prisma } from "../../../shared/database/client.js";
export const teamModel = {
  findAll: (query = {}) =>
    prisma.team.findMany({
      include: { leader: { select: { id: true, firstName: true, lastName: true } }, _count: { select: { employees: true } } },
      orderBy: { name: "asc" },
    }),
  create: (data) =>
    prisma.team.create({
      data,
      include: { leader: { select: { id: true, firstName: true, lastName: true } }, _count: { select: { employees: true } } },
    }),
  update: (id, data) =>
    prisma.team.update({
      where: { id },
      data,
      include: { leader: { select: { id: true, firstName: true, lastName: true } }, _count: { select: { employees: true } } },
    }),
  remove: (id) => prisma.team.delete({ where: { id } }),
};
