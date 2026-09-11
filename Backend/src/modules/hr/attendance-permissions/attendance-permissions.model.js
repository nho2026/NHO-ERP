import { prisma } from "../../../shared/database/client.js";

const include = { employee: { include: { position: true } } };
export const attendancePermissionModel = {
  findAll: (query = {}) =>
    prisma.attendancePermission.findMany({
      where: {
        ...(query.employeeId && { employeeId: query.employeeId }),
        ...(query.status && { status: query.status }),
        ...((query.from || query.to) && {
          fromDate: { ...(query.to && { lte: new Date(query.to) }) },
          toDate: { ...(query.from && { gte: new Date(query.from) }) },
        }),
      },
      include,
      orderBy: { fromDate: "desc" },
    }),
  create: (data) => prisma.attendancePermission.create({ data, include }),
  update: (id, data) =>
    prisma.attendancePermission.update({ where: { id }, data, include }),
  remove: (id) => prisma.attendancePermission.delete({ where: { id } }),
};
