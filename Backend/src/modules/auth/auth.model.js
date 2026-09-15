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
      ledTeams: { select: { id: true } },
      team: { select: { id: true, name: true, leaderId: true } },
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
      ledTeams: { select: { id: true } },
      team: { select: { id: true, name: true, leaderId: true } },
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
  findOwnEvents: (employeeId) =>
    prisma.attendanceEvent.findMany({
      where: { person: { employeeId } },
      include: { device: { select: { name: true } } },
      orderBy: { occurredAt: "desc" },
      take: 100,
    }),
};
