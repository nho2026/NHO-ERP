import { prisma } from "../../../shared/database/client.js";
const recordInclude = {
  user: {
    select: { id: true, username: true, email: true, name: true, status: true },
  },
  position: true,
  department: true,
  _count: {
    select: {
      contracts: true,
      salaries: true,
      attendance: true,
      payrolls: true,
      devicePeople: true,
    },
  },
};
export const employeeModel = {
  findAll: (query = {}) =>
    prisma.employee.findMany({
      include: recordInclude,
      orderBy: { createdAt: "desc" },
    }),
  create: (data) => prisma.employee.create({ data, include: recordInclude }),
  update: (id, data) =>
    prisma.employee.update({ where: { id }, data, include: recordInclude }),
  remove: (id) => prisma.employee.delete({ where: { id } }),
};
