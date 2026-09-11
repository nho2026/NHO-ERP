import { Router } from "express";
import { validate } from "../../../shared/middleware/validation.middleware.js";
import { requirePermission } from "../../../shared/middleware/permission.middleware.js";
import { payrollController } from "./payrolls.controller.js";
import { payrollSchema } from "./payrolls.schema.js";
const router = Router();
const view = requirePermission("employees.view"),
  process = requirePermission("payroll.process");
router.get("/", view, payrollController.list);
router.post("/", process, validate(payrollSchema), payrollController.create);
router.patch(
  "/:id",
  process,
  validate(payrollSchema.partial()),
  payrollController.update,
);
router.delete("/:id", process, payrollController.remove);
export default router;
