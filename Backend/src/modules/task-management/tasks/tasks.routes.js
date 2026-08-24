import { Router } from "express";
import multer from "multer";
import path from "node:path";
import { mkdirSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { requirePermission } from "../../../shared/middleware/permission.middleware.js";
import { validate } from "../../../shared/middleware/validation.middleware.js";
import { taskController as c } from "./tasks.controller.js";
import {
  taskSchema,
  updateTaskSchema,
  commentSchema,
  timeEntrySchema,
  monthlyReportSchema,
} from "./tasks.schema.js";
const dir = path.resolve(process.cwd(), "public", "task-attachments");
mkdirSync(dir, { recursive: true });
const upload = multer({
  storage: multer.diskStorage({
    destination: dir,
    filename: (_r, f, done) =>
      done(
        null,
        `${randomUUID()}${path.extname(f.originalname).toLowerCase()}`,
      ),
  }),
  limits: { fileSize: 10 * 1024 * 1024, files: 10 },
});
const router = Router(),
  view = requirePermission("employees.view"),
  manage = requirePermission("employees.manage");
router.get("/", view, c.list);
router.get("/reports/monthly", view, (req, res, next) => {
  const result = monthlyReportSchema.safeParse(req.query);
  if (!result.success)
    return res
      .status(422)
      .json({
        message: "Validation failed.",
        errors: result.error.flatten().fieldErrors,
      });
  req.validatedBody = result.data;
  c.monthlyReport(req, res, next);
});
router.get("/:id", view, c.get);
router.post("/uploads", manage, upload.array("files", 10), c.upload);
router.post("/", manage, validate(taskSchema), c.create);
router.patch("/:id", manage, validate(updateTaskSchema), c.update);
router.delete("/:id", manage, c.remove);
router.post("/:id/attachments", manage, upload.array("files", 10), c.attach);
router.post("/:id/comments", view, validate(commentSchema), c.comment);
router.post("/:id/time-entries", view, validate(timeEntrySchema), c.addTime);
export default router;
