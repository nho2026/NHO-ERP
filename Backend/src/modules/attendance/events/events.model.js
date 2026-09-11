import { createHash } from "node:crypto";
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
    if (existing && existing.employeeNo === data.employeeNo && existing.eventType === data.eventType && existing.occurredAt.getTime() === data.occurredAt.getTime())
      return { event: existing, created: false };
    // Device serial numbers can be reused after its event history is cleared.
    if (existing) {
      deviceEventId = createHash("sha256").update(`${deviceEventId}:${data.employeeNo}:${data.eventType}:${data.occurredAt.toISOString()}`).digest("hex");
    }

    const duplicate = await prisma.attendanceEvent.findFirst({
      where: {
        deviceId,
        employeeNo: data.employeeNo,
        eventType: data.eventType,
        occurredAt: data.occurredAt,
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
