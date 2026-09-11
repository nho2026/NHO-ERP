import { prisma } from "../../../shared/database/client.js";
const include = { roles: { include: { role: true } } };
export const userModel = {
  hasSuperadminRole: (roleIds) => prisma.role.count({ where: { id: { in: roleIds }, name: "Super Administrator" } }).then(count => count > 0),
  findById: id => prisma.user.findUniqueOrThrow({ where: { id }, include }),
  findAll: () =>
    prisma.user.findMany({ include, orderBy: { createdAt: "desc" } }),
  create: (data) => prisma.user.create({ data, include }),
  update: (id, data) => prisma.user.update({ where: { id }, data, include }),
  remove: (id, replacementUserId) =>
    prisma.$transaction(async (tx) => {
      await tx.employeeTarget.updateMany({
        where: { createdById: id },
        data: { createdById: replacementUserId },
      });
      await tx.task.updateMany({
        where: { createdById: id },
        data: { createdById: replacementUserId },
      });
      await tx.warning.updateMany({
        where: { senderId: id },
        data: { senderId: replacementUserId },
      });
      await tx.taskTimeEntry.updateMany({
        where: { recordedById: id },
        data: { recordedById: replacementUserId },
      });
      await tx.meeting.updateMany({
        where: { creatorId: id },
        data: { creatorId: replacementUserId },
      });
      return tx.user.delete({ where: { id } });
    }),
  updatePassword: (id, passwordHash) =>
    prisma.user.update({ where: { id }, data: { passwordHash } }),
};
