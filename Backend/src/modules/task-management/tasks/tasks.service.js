import { taskModel } from "./tasks.model.js";
const split = ({ assigneeIds, attachments, ...data }) => ({
  data,
  assigneeIds,
  attachments,
});
export const taskService = {
  list(q, user) {
    const page = Math.max(1, Number(q.page) || 1),
      pageSize = Math.min(100, Math.max(1, Number(q.pageSize) || 50)),
      where = {
        ...(q.status && { status: String(q.status) }),
        ...(q.priority && { priority: String(q.priority) }),
        ...(q.team && { team: String(q.team) }),
        ...(q.assigneeId && {
          assignees: { some: { employeeId: String(q.assigneeId) } },
        }),
        ...(q.mine === "true" &&
          user.employee?.id && {
            assignees: { some: { employeeId: user.employee.id } },
          }),
        ...(q.search && {
          OR: [
            { title: { contains: String(q.search) } },
            { description: { contains: String(q.search) } },
          ],
        }),
      };
    return taskModel.findPage(where, page, pageSize);
  },
  get: taskModel.findById,
  async create(userId, input) {
    const { data, assigneeIds, attachments } = split(input);
    return taskModel.create(userId, {
      ...data,
      assignees: { create: assigneeIds.map((employeeId) => ({ employeeId })) },
      attachments: { create: attachments },
    });
  },
  async update(id, input) {
    const { assigneeIds, ...data } = input;
    if (data.status === "completed") data.completedAt = new Date();
    else if (data.status) data.completedAt = null;
    return taskModel.update(id, {
      ...data,
      ...(assigneeIds && {
        assignees: {
          deleteMany: {},
          create: assigneeIds.map((employeeId) => ({ employeeId })),
        },
      }),
    });
  },
  remove: taskModel.remove,
  addAttachments: async (id, files) => {
    await taskModel.addAttachments(id, files);
    return taskModel.findById(id);
  },
  addComment: taskModel.addComment,
  addTime: taskModel.addTime,
  async monthlyReport(month) {
    const [year, monthNumber] = month.split("-").map(Number);
    const from = new Date(Date.UTC(year, monthNumber - 1, 1));
    const to = new Date(Date.UTC(year, monthNumber, 1));
    const [tasks, entries] = await taskModel.reportData(from, to);
    const created = tasks.filter(
      (task) => task.createdAt >= from && task.createdAt < to,
    );
    const completed = tasks.filter(
      (task) =>
        task.completedAt && task.completedAt >= from && task.completedAt < to,
    );
    const overdue = tasks.filter(
      (task) =>
        task.dueDate &&
        task.dueDate < new Date() &&
        !["completed", "cancelled"].includes(task.status),
    );
    const minutes = entries.reduce((sum, entry) => sum + entry.minutes, 0);
    const estimatedMinutes = tasks.reduce(
      (sum, task) => sum + (task.estimatedMinutes ?? 0),
      0,
    );
    const employeeMap = new Map();
    for (const entry of entries) {
      const current = employeeMap.get(entry.employeeId) ?? {
        employeeId: entry.employeeId,
        employeeName: `${entry.employee.firstName} ${entry.employee.lastName}`,
        minutes: 0,
        entries: 0,
      };
      current.minutes += entry.minutes;
      current.entries += 1;
      employeeMap.set(entry.employeeId, current);
    }
    const teamMap = new Map();
    for (const task of tasks) {
      const team = task.team ?? "other",
        current = teamMap.get(team) ?? {
          team,
          assigned: 0,
          completed: 0,
          minutes: 0,
        };
      current.assigned += 1;
      if (task.status === "completed") current.completed += 1;
      current.minutes += task.timeEntries.reduce(
        (sum, entry) => sum + entry.minutes,
        0,
      );
      teamMap.set(team, current);
    }
    return {
      month,
      summary: {
        created: created.length,
        completed: completed.length,
        overdue: overdue.length,
        completionRate: created.length
          ? Math.round((completed.length / created.length) * 100)
          : 0,
        estimatedMinutes,
        trackedMinutes: minutes,
        varianceMinutes: minutes - estimatedMinutes,
      },
      employees: [...employeeMap.values()].sort(
        (a, b) => b.minutes - a.minutes,
      ),
      teams: [...teamMap.values()],
    };
  },
};
