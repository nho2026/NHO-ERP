import { Router } from "express";
import { validate } from "../../shared/middleware/validation.middleware.js";
import { healthcareController as c } from "./healthcare.controller.js";
import { bookingSchema } from "./healthcare.schema.js";
const router = Router();
router.get("/departments", c.publicDepartments);
router.get("/doctors", c.publicDoctors);
router.post("/appointments", validate(bookingSchema), c.book);
export default router;
