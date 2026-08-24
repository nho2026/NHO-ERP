import { prisma } from "../../../shared/database/client.js";
export const attendanceModel = {
  findAll: (query = {}) =>
    prisma.employeeAttendance.findMany({
      where: query.employeeId ? { employeeId: String(query.employeeId) } : {},
      include: { employee: true },
      orderBy: { attendanceDate: "desc" },
    }),
  create: (data) =>
    prisma.employeeAttendance.create({ data, include: { employee: true } }),
  update: (id, data) =>
    prisma.employeeAttendance.update({
      where: { id },
      data,
      include: { employee: true },
    }),
  remove: (id) => prisma.employeeAttendance.delete({ where: { id } }),
};
