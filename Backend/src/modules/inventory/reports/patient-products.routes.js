import { Router } from "express";
import { requirePermission } from "../../../shared/middleware/permission.middleware.js";
import { patientProductsController } from "./patient-products.controller.js";
const router = Router();
router.get(
  "/reports/products-per-patient",
  requirePermission("inventory.warehouses.view"),
  patientProductsController.list,
);
export default router;
