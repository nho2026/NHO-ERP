import { prisma } from "../../shared/database/client.js";
import { payrollAdjustmentData } from "../hr/payroll-adjustments/payroll-adjustments.service.js";

const fail = (status, message) => {
  throw Object.assign(new Error(message), { status });
};
const isManager = (permissions) =>
  permissions?.has("*") ||
  permissions?.has("employees.manage") ||
  permissions?.has("hr.employees.create") ||
  permissions?.has("hr.employees.update");
const include = {
  employee: {
    include: { position: true, department: true },
  },
  createdBy: { select: { id: true, name: true } },
};

function ensureAssigner(user, permissions) {
  if (!isManager(permissions) && !user.employee?.isTeamLeader)
    fail(403, "Only managers or team leaders can assign targets.");
}

async function eligibleEmployee(employeeId, user, permissions) {
  const employee = await prisma.employee.findUnique({ where: { id: employeeId } });
  if (!employee || employee.status !== "active") fail(422, "Employee is unavailable.");
  if (!isManager(permissions) && employee.teamLeaderId !== user.employee?.id)
    fail(403, "Team leaders can assign targets only to their employees.");
  return employee;
}

export const targetService = {
  list(user, permissions) {
    const where = isManager(permissions)
      ? {}
      : user.employee?.isTeamLeader
        ? { OR: [{ employeeId: user.employee.id }, { employee: { teamLeaderId: user.employee.id } }] }
        : user.employee?.id
          ? { employeeId: user.employee.id }
          : { id: "__none__" };
    return prisma.employeeTarget.findMany({ where, include, orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }] });
  },
  assignees(user, permissions) {
    ensureAssigner(user, permissions);
    return prisma.employee.findMany({
      where: {
        status: "active",
        ...(isManager(permissions) ? {} : { teamLeaderId: user.employee.id }),
      },
      include: { position: true, department: true },
      orderBy: [{ isTeamLeader: "desc" }, { firstName: "asc" }],
    });
  },
  async create(user, permissions, data) {
    ensureAssigner(user, permissions);
    await eligibleEmployee(data.employeeId, user, permissions);
    const status = data.currentValue >= data.targetValue ? "completed" : "active";
    return prisma.employeeTarget.create({ data: { ...data, status, createdById: user.id }, include });
  },
  async update(id, user, permissions, data) {
    const target = await prisma.employeeTarget.findUnique({ where: { id }, include: { employee: true } });
    if (!target) fail(404, "Target not found.");
    const ownsTarget = target.employeeId === user.employee?.id;
    const leadsEmployee = target.employee.teamLeaderId === user.employee?.id;
    if (!isManager(permissions) && !ownsTarget && !leadsEmployee) fail(403, "You cannot update this target.");
    const { rewardAmount, rewardReason, ...targetData } = data;
    if (targetData.currentValue != null && targetData.currentValue >= target.targetValue && !targetData.status)
      targetData.status = "completed";
    if (rewardAmount != null && !isManager(permissions) && !user.employee?.isTeamLeader)
      fail(403, "Only managers or team leaders can grant target rewards.");
    if (rewardAmount != null && targetData.status !== "completed" && target.status !== "completed")
      fail(422, "A reward can be granted only when the target is completed.");
    return prisma.$transaction(async (tx) => {
      const updated = await tx.employeeTarget.update({ where: { id }, data: targetData, include });
      if (rewardAmount != null) {
        await tx.payrollAdjustment.upsert({
          where: { sourceType_sourceId: { sourceType: "target", sourceId: id } },
          create: payrollAdjustmentData({ employeeId: target.employeeId, type: "reward", amount: rewardAmount, reason: rewardReason, sourceType: "target", sourceId: id }),
          update: payrollAdjustmentData({ employeeId: target.employeeId, type: "reward", amount: rewardAmount, reason: rewardReason }),
        });
      }
      return updated;
    });
  },
};
