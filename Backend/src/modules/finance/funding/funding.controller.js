import { createCrudController } from "../../../shared/controllers/crud.controller.js";
import { fundingService } from "./funding.service.js";
export const fundingController = createCrudController(fundingService);
