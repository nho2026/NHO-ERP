import { Router } from "express";
import { validate } from "../../../shared/middleware/validation.middleware.js";
import { eventsController as c } from "./events.controller.js";
import { syncEventsSchema } from "./events.schema.js";
import { requirePermission } from "../../../shared/middleware/permission.middleware.js";
const router = Router(), view = requirePermission("employees.view"), manage = requirePermission("employees.manage");
router.get("/", view, c.list);
router.post("/sync", manage, validate(syncEventsSchema), c.sync);
export default router;
