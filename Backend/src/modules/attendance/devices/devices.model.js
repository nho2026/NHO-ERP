import { prisma } from "../../../shared/database/client.js";
export const deviceModel = {
  findAll: () =>
    prisma.attendanceDevice.findMany({ orderBy: { createdAt: "desc" } }),
  findById: (id) =>
    prisma.attendanceDevice.findUniqueOrThrow({ where: { id } }),
  create: (data) => prisma.attendanceDevice.create({ data }),
  update: (id, data) => prisma.attendanceDevice.update({ where: { id }, data }),
  remove: (id) => prisma.attendanceDevice.delete({ where: { id } }),
  async clearEvents(id, clearedAt) {
    return prisma.$transaction(async (tx) => {
      const deleted = await tx.attendanceEvent.deleteMany({
        where: { deviceId: id },
      });
      await tx.attendanceDevice.update({
        where: { id },
        data: { eventsClearedAt: clearedAt },
      });
      return deleted;
    });
  },
};
