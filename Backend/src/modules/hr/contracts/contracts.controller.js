import { createCrudController } from "../../../shared/controllers/crud.controller.js";
import { contractService } from "./contracts.service.js";
export const contractController = createCrudController(contractService);
