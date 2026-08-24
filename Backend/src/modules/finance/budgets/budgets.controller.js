import { createCrudController } from "../../../shared/controllers/crud.controller.js";
import { budgetService } from "./budgets.service.js";
export const budgetController = createCrudController(budgetService);
