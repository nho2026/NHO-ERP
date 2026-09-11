import { Router } from "express";
import multer from "multer";
import path from "node:path";
import { mkdirSync } from "node:fs";
import { randomUUID } from "node:crypto";
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
const hr = (req, res, next) => {
  const allowed =
    req.permissionKeys?.has("*") ||
    req.permissionKeys?.has("employees.manage") ||
    req.permissionKeys?.has("hr.employees.create") ||
    req.permissionKeys?.has("hr.employees.update") ||
    req.permissionKeys?.has("hr.employees.delete");
  if (!allowed)
    return res.status(403).json({ message: "HR access is required." });
  next();
};
const router = Router();
router.get("/", c.list);
router.get("/assignees", c.assignees);
router.get("/reports/monthly", hr, (req, res, next) => {
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
router.get("/:id", c.get);
router.post("/uploads", upload.array("files", 10), c.upload);
router.post("/", validate(taskSchema), c.create);
router.patch("/:id", validate(updateTaskSchema), c.update);
router.delete("/:id", hr, c.remove);
router.post("/:id/attachments", upload.array("files", 10), c.attach);
router.post("/:id/comments", validate(commentSchema), c.comment);
router.post("/:id/time-entries", validate(timeEntrySchema), c.addTime);
export default router;
