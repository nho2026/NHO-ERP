import { Router } from "express";
import { requireAuth } from "../../shared/middleware/auth.middleware.js";
import {
  requireAnyPermission,
  requirePermission,
} from "../../shared/middleware/permission.middleware.js";
import { validate } from "../../shared/middleware/validation.middleware.js";
import { healthcareController as c } from "./healthcare.controller.js";
import {
  departmentSchema,
  staffSchema,
  appointmentSchema,
} from "./healthcare.schema.js";
const router = Router();
router.use(requireAuth);
const view = requirePermission("employees.view"),
  manage = requirePermission("employees.manage");
router.get(
  "/departments",
  requireAnyPermission("employees.view", "users.create", "users.update"),
  c.departments,
);
router.post(
  "/departments",
  manage,
  validate(departmentSchema),
  c.createDepartment,
);
router.patch(
  "/departments/:id",
  manage,
  validate(departmentSchema.partial()),
  c.updateDepartment,
);
router.delete("/departments/:id", manage, c.removeDepartment);
router.get("/staff", view, c.staff);
router.post("/staff", manage, validate(staffSchema), c.createStaff);
router.patch(
  "/staff/:id",
  manage,
  validate(staffSchema.partial()),
  c.updateStaff,
);
router.delete("/staff/:id", manage, c.removeStaff);
router.get("/appointments", view, c.appointments);
router.post(
  "/appointments",
  manage,
  validate(appointmentSchema),
  c.createAppointment,
);
router.patch(
  "/appointments/:id",
  manage,
  validate(appointmentSchema.partial()),
  c.updateAppointment,
);
router.delete("/appointments/:id", manage, c.removeAppointment);
export default router;
