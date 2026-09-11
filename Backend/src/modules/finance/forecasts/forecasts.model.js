import { prisma } from "../../../shared/database/client.js";
export const forecastModel = {
  async findPage(page, pageSize) {
    const [items, total] = await prisma.$transaction([
      prisma.financeForecast.findMany({
        orderBy: { periodStart: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.financeForecast.count(),
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
  create: (data) => prisma.financeForecast.create({ data }),
  update: (id, data) => prisma.financeForecast.update({ where: { id }, data }),
  remove: (id) => prisma.financeForecast.delete({ where: { id } }),
};
