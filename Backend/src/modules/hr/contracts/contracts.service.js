import { createCrudService } from "../../../shared/services/crud.service.js";
import { contractModel } from "./contracts.model.js";
export const contractService = createCrudService(contractModel);
