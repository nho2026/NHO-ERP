import { prisma } from "../../../shared/database/client.js";
export const permissionModel = {
  findAll: () =>
    prisma.permission.findMany({
      orderBy: [{ module: "asc" }, { name: "asc" }],
    }),
};
