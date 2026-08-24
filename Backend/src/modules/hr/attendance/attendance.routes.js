import { Router } from "express";
import { validate } from "../../../shared/middleware/validation.middleware.js";
import { requirePermission } from "../../../shared/middleware/permission.middleware.js";
import { attendanceController } from "./attendance.controller.js";
import { attendanceSchema } from "./attendance.schema.js";
const router = Router();
const view = requirePermission("employees.view"),
  manage = requirePermission("employees.manage");
router.get("/", view, attendanceController.list);
router.post(
  "/",
  manage,
  validate(attendanceSchema),
  attendanceController.create,
);
router.patch(
  "/:id",
  manage,
  validate(attendanceSchema.partial()),
  attendanceController.update,
);
router.delete("/:id", manage, attendanceController.remove);
export default router;
