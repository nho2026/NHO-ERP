import { Router } from "express";
import { requireAuth } from "../../shared/middleware/auth.middleware.js";
import { validate } from "../../shared/middleware/validation.middleware.js";
import { crmController } from "./crm.controller.js";
import { crmSchemas, isCrmResource } from "./crm.schema.js";
import leadRoutes from "./lead/lead.routes.js";
import patientRoutes from "./patient/patient.routes.js";
import formsRoutes from "./forms/forms.routes.js";

const router = Router();

const canView = (req, res, next) =>
  req.permissionKeys.has("*") ||
  req.permissionKeys.has("employees.view") ||
  req.permissionKeys.has("employees.manage")
    ? next()
    : res.status(403).json({ message: "CRM access is required." });

const canManage = (req, res, next) =>
  req.permissionKeys.has("*") || req.permissionKeys.has("employees.manage")
    ? next()
    : res.status(403).json({ message: "CRM management access is required." });

const validateResource =
  (partial = false) =>
  (req, res, next) =>
    validate(
      partial
        ? crmSchemas[req.params.resource].partial()
        : crmSchemas[req.params.resource],
    )(req, res, next);

router.use(requireAuth);
router.use("/leads", leadRoutes);
router.use("/patients", patientRoutes);
router.use("/forms", formsRoutes);
router.param("resource", (req, res, next, resource) =>
  isCrmResource(resource)
    ? next()
    : res.status(404).json({ message: "CRM resource not found." }),
);
router.get("/lookups", canView, crmController.lookups);
router.get("/:resource", canView, crmController.list);
router.post("/:resource", canManage, validateResource(), crmController.create);
router.patch(
  "/:resource/:id",
  canManage,
  validateResource(true),
  crmController.update,
);
router.delete("/:resource/:id", canManage, crmController.delete);

export default router;
