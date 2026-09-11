import { prisma } from "../../../shared/database/client.js";
import { paginate } from "../shared/pagination.model.js";
export const stockModel = {
  paginate,
  $transaction: (...args) => prisma.$transaction(...args),
};
