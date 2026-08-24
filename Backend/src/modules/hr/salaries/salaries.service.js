import { createCrudService } from "../../../shared/services/crud.service.js";
import { salaryModel } from "./salaries.model.js";
export const salaryService = createCrudService(salaryModel);
