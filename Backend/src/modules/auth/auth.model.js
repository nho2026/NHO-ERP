import { prisma } from "../../shared/database/client.js";

const roles = {
  roles: {
    include: {
      role: { include: { permissions: { include: { permission: true } } } },
    },
  },
};
const profileInclude = {
  ...roles,
  employee: {
    include: {
      position: true,
      department: true,
      devicePeople: {
        select: {
          id: true,
          employeeNo: true,
          device: { select: { id: true, name: true } },
        },
      },
    },
  },
};
const loginInclude = {
  ...roles,
  employee: {
    select: {
      id: true,
      employeeCode: true,
      firstName: true,
      lastName: true,
      departmentId: true,
      isTeamLeader: true,
      teamLeaderId: true,
      status: true,
    },
  },
};
export const authModel = {
  findByLogin: (login) =>
    prisma.user.findFirst({
      where: { OR: [{ username: login }, { email: login }] },
      include: loginInclude,
    }),
  findByPinLookup: (pinLookup) =>
    prisma.user.findUnique({ where: { pinLookup }, include: loginInclude }),
  getProfile: (id) =>
    prisma.user.findUniqueOrThrow({ where: { id }, include: profileInclude }),
  updateProfile: (id, data) =>
    prisma.user.update({ where: { id }, data, include: profileInclude }),
  getEmployeeIdentity: (userId) =>
    prisma.employee.findUnique({
      where: { userId },
      include: { devicePeople: { select: { employeeNo: true } } },
    }),
  findMatchingPeople: (employeeId, employeeNo, name) =>
    prisma.attendancePerson.findMany({
      where: {
        OR: [{ employeeId }, { employeeNo }, { name: { startsWith: name } }],
      },
      select: { employeeNo: true },
    }),
  findEvents: (employeeNumbers) =>
    prisma.attendanceEvent.findMany({
      where: { employeeNo: { in: employeeNumbers } },
      include: { device: { select: { name: true } } },
      orderBy: { occurredAt: "desc" },
      take: 100,
    }),
};
