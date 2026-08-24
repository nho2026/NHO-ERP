import { prisma } from "../../../shared/database/client.js";
export const eventsModel = {
  devices: (id) =>
    prisma.attendanceDevice.findMany({ where: id ? { id } : {} }),
  person: (deviceId, employeeNo) =>
    prisma.attendancePerson.findUnique({
      where: { deviceId_employeeNo: { deviceId, employeeNo } },
    }),
  people: (deviceId) =>
    prisma.attendancePerson.findMany({ where: { deviceId } }),
  upsert: (deviceId, deviceEventId, data) =>
    prisma.attendanceEvent.upsert({
      where: { deviceId_deviceEventId: { deviceId, deviceEventId } },
      update: {
        personId: data.personId,
        personName: data.personName,
        employeeNo: data.employeeNo,
        eventType: data.eventType,
        occurredAt: data.occurredAt,
        verification: data.verification,
      },
      create: { deviceId, deviceEventId, ...data },
    }),
  list: (where) =>
    prisma.attendanceEvent.findMany({
      where,
      include: { device: { select: { name: true } } },
      orderBy: { occurredAt: "desc" },
      take: 500,
    }),
  status: (id, data) => prisma.attendanceDevice.update({ where: { id }, data }),
};
