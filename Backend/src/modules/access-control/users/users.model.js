import { prisma } from "../../../shared/database/client.js";
const include = { roles: { include: { role: true } } };
export const userModel = {
  findAll: () =>
    prisma.user.findMany({ include, orderBy: { createdAt: "desc" } }),
  create: (data) => prisma.user.create({ data, include }),
  update: (id, data) => prisma.user.update({ where: { id }, data, include }),
  remove: (id) => prisma.user.delete({ where: { id } }),
  updatePassword: (id, passwordHash) =>
    prisma.user.update({ where: { id }, data: { passwordHash } }),
};
