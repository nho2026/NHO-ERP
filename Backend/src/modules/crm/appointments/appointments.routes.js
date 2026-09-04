import { Router } from "express";
import { requirePermission } from "../../../shared/middleware/permission.middleware.js";
import { validate } from "../../../shared/middleware/validation.middleware.js";
import { appointmentsController } from "./appointments.controller.js";
import { appointmentSchema } from "./appointments.schema.js";

const router = Router();
const canViewAppointments = requirePermission("employees.view");
const canManageAppointments = requirePermission("employees.manage");

router.get("/", canViewAppointments, appointmentsController.list);
router.post(
  "/",
  canManageAppointments,
  validate(appointmentSchema),
  appointmentsController.create,
);
router.patch(
  "/:id",
  canManageAppointments,
  validate(appointmentSchema.partial()),
  appointmentsController.update,
);
router.delete("/:id", canManageAppointments, appointmentsController.remove);

export default router;
