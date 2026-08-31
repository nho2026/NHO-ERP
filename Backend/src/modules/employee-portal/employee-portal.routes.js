import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../shared/database/client.js";
import { requireAuth } from "../../shared/middleware/auth.middleware.js";
import { validate } from "../../shared/middleware/validation.middleware.js";

const router = Router();
router.use(requireAuth);
router.get("/my-tasks", async (req, res, next) => {
  try {
    if (!req.user.employee?.id) return res.json([]);
    res.json(await prisma.task.findMany({
      where: { assignees: { some: { employeeId: req.user.employee.id } } },
      include: { createdBy: { select: { id: true, name: true } } },
      orderBy: [{ status: "asc" }, { dueDate: "asc" }, { createdAt: "desc" }],
    }));
  } catch (error) { next(error); }
});
router.get("/ideas", async (req, res, next) => {
  try { res.json(await prisma.employeeIdea.findMany({ where: { userId: req.user.id }, orderBy: { createdAt: "desc" } })); }
  catch (error) { next(error); }
});
router.post("/ideas", validate(z.object({ title: z.string().trim().min(2).max(200), description: z.string().trim().min(5).max(10000) })), async (req, res, next) => {
  try { res.status(201).json(await prisma.employeeIdea.create({ data: { ...req.validatedBody, userId: req.user.id } })); }
  catch (error) { next(error); }
});
router.get("/warnings", async (req, res, next) => {
  try { res.json(await prisma.warningRecipient.findMany({ where: { userId: req.user.id }, include: { warning: { include: { sender: { select: { id: true, name: true } } } } }, orderBy: { warning: { createdAt: "desc" } } })); }
  catch (error) { next(error); }
});
export default router;
