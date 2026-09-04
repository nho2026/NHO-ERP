import { prisma } from "../../../shared/database/client.js";

const appointmentInclude = {
  doctor: { include: { employee: true } },
  department: true,
};

export const appointmentsModel = {
  list: (query) =>
    prisma.appointment.findMany({
      where: {
        ...(query.status && { status: String(query.status) }),
        ...(query.departmentId && { departmentId: String(query.departmentId) }),
        ...(query.doctorId && { doctorId: String(query.doctorId) }),
      },
      include: appointmentInclude,
      orderBy: { scheduledAt: "desc" },
      take: 1000,
    }),
  findById: (id) => prisma.appointment.findUniqueOrThrow({ where: { id } }),
  create: (data, publicBooking = false) =>
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
  update: (id, data) =>
    prisma.appointment.update({
      where: { id },
      data,
      include: appointmentInclude,
    }),
  remove: (id) => prisma.appointment.delete({ where: { id } }),
  findDoctor: (id) => prisma.healthStaff.findUniqueOrThrow({ where: { id } }),
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
};
