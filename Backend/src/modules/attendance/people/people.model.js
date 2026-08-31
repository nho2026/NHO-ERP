import { prisma } from "../../../shared/database/client.js";
export const peopleModel = {
  devices: (id) =>
    prisma.attendanceDevice.findMany({ where: id ? { id } : {} }),
  employee: async (code) =>
    (
      await prisma.employee.findUnique({
        where: { employeeCode: String(code) },
        select: { id: true },
      })
    )?.id,
  findAll: (deviceId) =>
    prisma.attendancePerson.findMany({
      where: deviceId ? { deviceId } : {},
      include: {
        device: { select: { name: true } },
        employee: {
          select: {
            id: true,
            employeeCode: true,
            firstName: true,
            lastName: true,
            user: { select: { id: true, name: true, username: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  find: (id) =>
    prisma.attendancePerson.findUniqueOrThrow({
      where: { id },
      include: { device: true },
    }),
  findNumber: (deviceId, employeeNo) =>
    prisma.attendancePerson.findUnique({
      where: { deviceId_employeeNo: { deviceId, employeeNo } },
    }),
  upsert: (deviceId, employeeNo, data) =>
    prisma.attendancePerson.upsert({
      where: { deviceId_employeeNo: { deviceId, employeeNo } },
      update: data,
      create: { deviceId, employeeNo, ...data },
    }),
  create: (data) => prisma.attendancePerson.create({ data }),
  update: (id, data) => prisma.attendancePerson.update({ where: { id }, data }),
  remove: (id) => prisma.attendancePerson.delete({ where: { id } }),
  deviceStatus: (id, data) =>
    prisma.attendanceDevice.update({ where: { id }, data }),
};
