import { prisma } from "../../../shared/database/client.js";
import { pageInput } from "./pagination.schema.js";
export async function paginate(query, model, args) {
  if (query.all === "true") return prisma[model].findMany(args);
  const { page, pageSize } = pageInput(query);
  const [items, total] = await prisma.$transaction([
    prisma[model].findMany({
      ...args,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma[model].count({ where: args.where }),
  ]);
  return {
    items,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    },
  };
}
