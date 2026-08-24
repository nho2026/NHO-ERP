import { prisma } from "../../../shared/database/client.js";
export const fundingModel = {
  async findPage(page, pageSize) {
    const [items, total] = await prisma.$transaction([
      prisma.financeFunding.findMany({
        orderBy: { startDate: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.financeFunding.count(),
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
  },
  create: (data) => prisma.financeFunding.create({ data }),
  update: (id, data) => prisma.financeFunding.update({ where: { id }, data }),
  remove: (id) => prisma.financeFunding.delete({ where: { id } }),
};
