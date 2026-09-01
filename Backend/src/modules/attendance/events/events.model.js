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
  saveUnique: async (deviceId, deviceEventId, data) => {
    const existing = await prisma.attendanceEvent.findUnique({
      where: { deviceId_deviceEventId: { deviceId, deviceEventId } },
    });
    if (existing) return { event: existing, created: false };

    const duplicate = await prisma.attendanceEvent.findFirst({
      where: {
        deviceId,
        employeeNo: data.employeeNo,
        eventType: data.eventType,
        occurredAt: {
          gte: new Date(data.occurredAt.getTime() - 60 * 60 * 1000),
          lte: new Date(data.occurredAt.getTime() + 60 * 60 * 1000),
        },
      },
      orderBy: { occurredAt: "asc" },
    });
    if (duplicate) return { event: duplicate, created: false };

    return {
      event: await prisma.attendanceEvent.create({
        data: { deviceId, deviceEventId, ...data },
      }),
      created: true,
    };
  },
  list: (where) =>
    prisma.attendanceEvent.findMany({
      where,
      include: {
        device: { select: { name: true } },
        person: { select: { id: true, employeeId: true } },
      },
      orderBy: { occurredAt: "desc" },
      take: 10000,
    }),
  status: (id, data) => prisma.attendanceDevice.update({ where: { id }, data }),
};
