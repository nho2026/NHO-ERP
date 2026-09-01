import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../shared/database/client.js";
import { requireAuth } from "../../shared/middleware/auth.middleware.js";
import { requireAnyPermission } from "../../shared/middleware/permission.middleware.js";
import {
  pageResult,
  paginationArgs,
} from "../../shared/pagination/pagination.js";

const router = Router();
router.use(requireAuth, requireAnyPermission("system.logs.view", "roles.view"));

router.get("/", async (req, res, next) => {
  try {
    const query = z
      .object({
        page: z.coerce.number().int().min(1).optional(),
        pageSize: z.coerce.number().int().min(1).max(100).optional(),
        search: z.string().trim().max(100).optional(),
        module: z.string().trim().max(100).optional(),
        action: z.enum(["login", "create", "update", "delete"]).optional(),
        result: z.enum(["success", "failed"]).optional(),
        from: z.coerce.date().optional(),
        to: z.coerce.date().optional(),
      })
      .parse(req.query);
    const { page, pageSize, skip, take } = paginationArgs(query);
    const where = {
      action: query.action
        ? query.action
        : { in: ["login", "create", "update", "delete"] },
      ...(query.module && { module: query.module }),
      ...(query.result === "success" && { statusCode: { lt: 400 } }),
      ...(query.result === "failed" && { statusCode: { gte: 400 } }),
      ...((query.from || query.to) && {
        createdAt: {
          ...(query.from && { gte: query.from }),
          ...(query.to && { lte: query.to }),
        },
      }),
      ...(query.search && {
        OR: [
          { userName: { contains: query.search } },
          { path: { contains: query.search } },
          { module: { contains: query.search } },
          { ipAddress: { contains: query.search } },
        ],
      }),
    };
    const [items, total, modules] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.auditLog.count({ where }),
      prisma.auditLog.findMany({
        where: { action: { in: ["login", "create", "update", "delete"] } },
        distinct: ["module"],
        select: { module: true },
        orderBy: { module: "asc" },
      }),
    ]);
    res.json({
      ...pageResult(items, total, page, pageSize),
      modules: modules.map((item) => item.module),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
