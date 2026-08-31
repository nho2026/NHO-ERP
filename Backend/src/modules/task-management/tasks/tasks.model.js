import { prisma } from "../../../shared/database/client.js";
const include = {
  createdBy: { select: { id: true, name: true } },
  reviewedBy: { select: { id: true, name: true } },
  assignees: {
    include: {
      employee: {
        include: {
          position: true,
          department: true,
          user: { select: { id: true, name: true, email: true } },
        },
      },
    },
  },
  attachments: true,
  comments: {
    include: { author: { select: { id: true, name: true } } },
    orderBy: { createdAt: "asc" },
  },
  timeEntries: {
    include: {
      employee: { select: { id: true, firstName: true, lastName: true } },
    },
    orderBy: { workDate: "desc" },
  },
};
export const taskModel = {
  include,
  async findPage(where, page, pageSize) {
    const [items, total] = await prisma.$transaction([
      prisma.task.findMany({
        where,
        include,
        orderBy: [{ createdAt: "desc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.task.count({ where }),
    ]);
    return {
      items,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      },
    };
  },
  findById: (id) => prisma.task.findUniqueOrThrow({ where: { id }, include }),
  findAccess: (id) =>
    prisma.task.findUniqueOrThrow({
      where: { id },
      select: {
        id: true,
        status: true,
        createdById: true,
        assignees: {
          select: {
            employeeId: true,
            employee: { select: { teamLeaderId: true } },
          },
        },
      },
    }),
  eligibleEmployees: (where) =>
    prisma.employee.findMany({
      where: { status: "active", userId: { not: null }, ...where },
      include: {
        position: true,
        department: true,
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: [{ department: { name: "asc" } }, { firstName: "asc" }],
    }),
  employeeScopes: (ids) =>
    prisma.employee.findMany({
      where: { id: { in: ids } },
      select: { id: true, teamLeaderId: true, userId: true },
    }),
  hrUserIds: () =>
    prisma.user.findMany({
      where: {
        status: "active",
        roles: {
          some: {
            role: {
              OR: [
                { name: "Super Administrator" },
                {
                  permissions: {
                    some: {
                      permission: {
                        key: {
                          in: [
                            "employees.manage",
                            "hr.employees.create",
                            "hr.employees.update",
                            "hr.employees.delete",
                          ],
                        },
                      },
                    },
                  },
                },
              ],
            },
          },
        },
      },
      select: { id: true },
    }),
  notify: (taskId, type, userIds) =>
    userIds.length
      ? prisma.notification.createMany({
          data: [...new Set(userIds)].map((userId) => ({ userId, taskId, type })),
        })
      : Promise.resolve(),
  create: (createdById, data) =>
    prisma.$transaction(async (tx) => {
      const task = await tx.task.create({
        data: { ...data, createdById },
        include,
      });
      const userIds = task.assignees
        .map(({ employee }) => employee.user?.id)
        .filter(Boolean);
      if (userIds.length)
        await tx.notification.createMany({
          data: userIds.map((userId) => ({
            userId,
            taskId: task.id,
            type: "task_assigned",
          })),
        });
      return task;
    }),
  update: (id, data) =>
    prisma.$transaction(async (tx) => {
      const previous = data.assignees
        ? await tx.taskAssignee.findMany({
            where: { taskId: id },
            select: { employeeId: true },
          })
        : [];
      const task = await tx.task.update({ where: { id }, data, include });
      if (data.assignees) {
        const previousIds = new Set(previous.map(({ employeeId }) => employeeId));
        const userIds = task.assignees
          .filter(({ employeeId }) => !previousIds.has(employeeId))
          .map(({ employee }) => employee.user?.id)
          .filter(Boolean);
        if (userIds.length)
          await tx.notification.createMany({
            data: userIds.map((userId) => ({
              userId,
              taskId: task.id,
              type: "task_assigned",
            })),
          });
      }
      return task;
    }),
  remove: (id) => prisma.task.delete({ where: { id } }),
  addAttachments: (taskId, files) =>
    prisma.taskAttachment.createMany({
      data: files.map((file) => ({ taskId, ...file })),
    }),
  addComment: (taskId, authorId, body) =>
    prisma.taskComment.create({
      data: { taskId, authorId, body },
      include: { author: { select: { id: true, name: true } } },
    }),
  addTime: (taskId, recordedById, data) =>
    prisma.taskTimeEntry.create({
      data: { taskId, recordedById, ...data },
      include: {
        employee: { select: { id: true, firstName: true, lastName: true } },
      },
    }),
  reportData: (from, to) =>
    Promise.all([
      prisma.task.findMany({
        where: {
          OR: [
            { createdAt: { gte: from, lt: to } },
            { completedAt: { gte: from, lt: to } },
            { dueDate: { gte: from, lt: to } },
          ],
        },
        include: {
          assignees: {
            include: {
              employee: {
                select: { id: true, firstName: true, lastName: true },
              },
            },
          },
          timeEntries: { where: { workDate: { gte: from, lt: to } } },
        },
      }),
      prisma.taskTimeEntry.findMany({
        where: { workDate: { gte: from, lt: to } },
        include: {
          employee: { select: { id: true, firstName: true, lastName: true } },
          task: { select: { team: true } },
        },
      }),
    ]),
};
