import { Router } from "express";
import { requireAuth } from "../../../shared/middleware/auth.middleware.js";
import { requirePermission } from "../../../shared/middleware/permission.middleware.js";
import { validate } from "../../../shared/middleware/validation.middleware.js";
import { userController } from "./users.controller.js";
import {
  createUserSchema,
  updateUserSchema,
  passwordSchema,
} from "./users.schema.js";
const router = Router();
router.use(requireAuth);
router.get("/", requirePermission("users.view"), userController.list);
router.post(
  "/",
  requirePermission("users.create"),
  validate(createUserSchema),
  userController.create,
);
router.patch(
  "/:id",
  requirePermission("users.update"),
  validate(updateUserSchema),
  userController.update,
);
router.delete("/:id", requirePermission("users.delete"), userController.remove);
router.post(
  "/:id/password",
  validate(passwordSchema),
  userController.changePassword,
);
export default router;
