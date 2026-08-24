import { Router } from "express";
import { validate } from "../../../shared/middleware/validation.middleware.js";
import { requirePermission } from "../../../shared/middleware/permission.middleware.js";
import { contractController } from "./contracts.controller.js";
import { contractSchema } from "./contracts.schema.js";
const router = Router();
const view = requirePermission("employees.view"),
  manage = requirePermission("employees.manage");
router.get("/", view, contractController.list);
router.post("/", manage, validate(contractSchema), contractController.create);
router.patch(
  "/:id",
  manage,
  validate(contractSchema.partial()),
  contractController.update,
);
router.delete("/:id", manage, contractController.remove);
export default router;
