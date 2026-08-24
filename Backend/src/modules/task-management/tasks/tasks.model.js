import { prisma } from "../../../shared/database/client.js";
const include = {
  createdBy: { select: { id: true, name: true } },
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
  create: (createdById, data) =>
    prisma.task.create({ data: { ...data, createdById }, include }),
  update: (id, data) => prisma.task.update({ where: { id }, data, include }),
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
