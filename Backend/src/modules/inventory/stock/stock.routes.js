import { Router } from "express";
import { view, adjust } from "../shared/inventory.permissions.js";
import { stockController } from "./stock.controller.js";
const router = Router();
router.get("/stock", view, stockController.list);
router.post("/adjust", adjust, stockController.adjust);
export default router;
