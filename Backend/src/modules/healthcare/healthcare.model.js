import { prisma } from "../../shared/database/client.js";
const departmentInclude = {
    manager: {
      select: { id: true, employeeCode: true, firstName: true, lastName: true },
    },
    _count: {
      select: { employees: true, healthStaff: true, appointments: true },
    },
  },
  staffInclude = {
    employee: { include: { position: true } },
    department: true,
    _count: { select: { appointments: true } },
  };
export const healthcareModel = {
  listDepartments: () =>
    prisma.department.findMany({
      include: departmentInclude,
      orderBy: { name: "asc" },
    }),
  createDepartment: (data) =>
    prisma.department.create({ data, include: departmentInclude }),
  updateDepartment: (id, data) =>
    prisma.department.update({
      where: { id },
      data,
      include: departmentInclude,
    }),
  removeDepartment: (id) => prisma.department.delete({ where: { id } }),
  assignDepartment: (employeeId, departmentId) =>
    prisma.employee.update({
      where: { id: employeeId },
      data: { departmentId },
    }),
  listStaff: (q) =>
    prisma.healthStaff.findMany({
      where: {
        ...(q.staffType && { staffType: String(q.staffType) }),
        ...(q.departmentId && { departmentId: String(q.departmentId) }),
      },
      include: staffInclude,
      orderBy: { createdAt: "desc" },
    }),
  createStaff: (data) =>
    prisma.healthStaff.create({ data, include: staffInclude }),
  updateStaff: (id, data) =>
    prisma.healthStaff.update({ where: { id }, data, include: staffInclude }),
  removeStaff: (id) => prisma.healthStaff.delete({ where: { id } }),
  publicDepartments: () =>
    prisma.department.findMany({
      where: { status: "active" },
      select: { id: true, code: true, name: true, description: true },
      orderBy: { name: "asc" },
    }),
  publicDoctors: (departmentId) =>
    prisma.healthStaff.findMany({
      where: {
        staffType: "doctor",
        status: "active",
        publicBookingEnabled: true,
        ...(departmentId && { departmentId: String(departmentId) }),
      },
      select: {
        id: true,
        specialization: true,
        biography: true,
        department: { select: { id: true, name: true } },
        employee: { select: { firstName: true, lastName: true } },
      },
      orderBy: { employee: { firstName: "asc" } },
    }),
};
