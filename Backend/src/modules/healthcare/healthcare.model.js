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
  },
  appointmentInclude = {
    doctor: { include: { employee: true } },
    department: true,
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
  listAppointments: (q) =>
    prisma.appointment.findMany({
      where: {
        ...(q.status && { status: String(q.status) }),
        ...(q.departmentId && { departmentId: String(q.departmentId) }),
        ...(q.doctorId && { doctorId: String(q.doctorId) }),
      },
      include: appointmentInclude,
      orderBy: { scheduledAt: "desc" },
      take: 1000,
    }),
  getAppointment: (id) =>
    prisma.appointment.findUniqueOrThrow({ where: { id } }),
  createAppointment: (data, publicBooking = false) =>
    prisma.appointment.create({
      data,
      ...(publicBooking
        ? {
            select: {
              id: true,
              scheduledAt: true,
              status: true,
              createdAt: true,
            },
          }
        : { include: appointmentInclude }),
    }),
  updateAppointment: (id, data) =>
    prisma.appointment.update({
      where: { id },
      data,
      include: appointmentInclude,
    }),
  removeAppointment: (id) => prisma.appointment.delete({ where: { id } }),
  getDoctor: (id) => prisma.healthStaff.findUniqueOrThrow({ where: { id } }),
  findPublicDoctor: (doctorId, departmentId) =>
    prisma.healthStaff.findFirst({
      where: {
        id: doctorId,
        departmentId,
        staffType: "doctor",
        status: "active",
        publicBookingEnabled: true,
      },
    }),
  findConflict: (doctorId, scheduledAt) =>
    prisma.appointment.findFirst({
      where: { doctorId, scheduledAt, status: { not: "cancelled" } },
    }),
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
