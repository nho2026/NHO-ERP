import { getSettings } from "../../settings/settings.service.js";
import { prisma } from "../../../shared/database/client.js";
const recordInclude = {
  user: {
    select: { id: true, username: true, email: true, name: true, status: true },
  },
  position: true,
  department: true,
  teamLeader: {
    select: { id: true, employeeCode: true, firstName: true, lastName: true },
  },
  teamMembers: {
    select: { id: true, employeeCode: true, firstName: true, lastName: true },
  },
  _count: {
    select: {
      salaries: true,
      attendance: true,
      payrolls: true,
      devicePeople: true,
    },
  },
};

const employeeData = (input, updating = false) => {
  const { userId, departmentId, positionId, teamLeaderId, ...data } = input;
  const relation = (id) =>
    id
      ? { connect: { id } }
      : updating && id === null
        ? { disconnect: true }
        : undefined;
  return {
    ...data,
    ...(userId !== undefined && { user: relation(userId) }),
    ...(departmentId !== undefined && { department: relation(departmentId) }),
    ...(positionId !== undefined && { position: relation(positionId) }),
    ...(teamLeaderId !== undefined && { teamLeader: relation(teamLeaderId) }),
  };
};

const validateSchedule = (data) => {
  if (data.scheduleType === "dynamic" && !data.workSchedule?.length)
    throw Object.assign(
      new Error("Select at least one working day for a dynamic schedule."),
      { status: 422 },
    );
  if (data.checkInTime === data.checkOutTime && data.scheduleType !== "dynamic")
    throw Object.assign(
      new Error("Check-in and check-out must be different."),
      { status: 422 },
    );
};

const validateLeadership = async (id, input) => {
  if (!input.teamLeaderId) return;
  if (input.teamLeaderId === id)
    throw Object.assign(new Error("An employee cannot lead themselves."), {
      status: 422,
    });
  const [leader, current] = await Promise.all([
    prisma.employee.findUnique({
      where: { id: input.teamLeaderId },
      select: { isTeamLeader: true, departmentId: true },
    }),
    id
      ? prisma.employee.findUnique({
          where: { id },
          select: { departmentId: true },
        })
      : null,
  ]);
  const departmentId = input.departmentId ?? current?.departmentId;
  if (
    !leader?.isTeamLeader ||
    !departmentId ||
    leader.departmentId !== departmentId
  )
    throw Object.assign(
      new Error("The selected team leader must lead the same department."),
      { status: 422 },
    );
};

export const employeeModel = {
  findAll: (query = {}) =>
    prisma.employee.findMany({
      include: recordInclude,
      orderBy: { createdAt: "desc" },
    }),
  create: async (data) => {
    const settings = await getSettings("hr");
    data = {
      ...data,
      checkInTime: data.checkInTime ?? settings.startTime,
      checkOutTime: data.checkOutTime ?? settings.endTime,
    };
    validateSchedule(data);
    await validateLeadership(null, data);
    return prisma.employee.create({
      data: employeeData(data),
      include: recordInclude,
    });
  },
  update: async (id, data) => {
    const current = await prisma.employee.findUniqueOrThrow({ where: { id } });
    validateSchedule({ ...current, ...data });
    await validateLeadership(id, data);
    if (data.isTeamLeader === false) {
      const members = await prisma.employee.count({
        where: { teamLeaderId: id },
      });
      if (members)
        throw Object.assign(
          new Error(
            "Reassign this leader's employees before removing leadership.",
          ),
          { status: 409 },
        );
    }
    return prisma.employee.update({
      where: { id },
      data: employeeData(data, true),
      include: recordInclude,
    });
  },
  remove: (id) =>
    prisma.$transaction(async (tx) => {
      // Relations that represent an identity link should survive, but no
      // longer point at an employee that is being removed.
      await tx.attendancePerson.updateMany({
        where: { employeeId: id },
        data: { employeeId: null },
      });
      await tx.department.updateMany({
        where: { managerId: id },
        data: { managerId: null },
      });
      await tx.employee.updateMany({
        where: { teamLeaderId: id },
        data: { teamLeaderId: null },
      });

      // Remove dependent operational/history rows in explicit FK order.
      // This avoids MySQL P2003 conflicts from SalaryAdvance (RESTRICT),
      // Payroll -> Salary, and Appointment -> HealthStaff.
      const staff = await tx.healthStaff.findUnique({
        where: { employeeId: id },
        select: { id: true },
      });
      if (staff) {
        await tx.appointment.deleteMany({ where: { doctorId: staff.id } });
        await tx.surgeryAppointment.deleteMany({
          where: { doctorId: staff.id },
        });
        await tx.healthStaff.delete({ where: { id: staff.id } });
      }
      await tx.salaryAdvance.deleteMany({ where: { employeeId: id } });
      await tx.payroll.deleteMany({ where: { employeeId: id } });
      await tx.employeeSalary.deleteMany({ where: { employeeId: id } });
      await tx.employeeAttendance.deleteMany({ where: { employeeId: id } });
      await tx.taskTimeEntry.deleteMany({ where: { employeeId: id } });
      await tx.taskAssignee.deleteMany({ where: { employeeId: id } });

      return tx.employee.delete({ where: { id } });
    }),
};
