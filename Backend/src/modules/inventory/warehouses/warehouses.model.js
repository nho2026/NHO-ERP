import { prisma } from "../../../shared/database/client.js";
import { paginate } from "../shared/pagination.model.js";
export const warehousesModel = {
  paginate,
  create: (...args) => prisma.inventoryWarehouse.create(...args),
  delete: (...args) => prisma.inventoryWarehouse.delete(...args),
  update: (...args) => prisma.inventoryWarehouse.update(...args),
};
