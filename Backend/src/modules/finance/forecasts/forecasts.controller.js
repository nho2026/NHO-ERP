import { createCrudController } from "../../../shared/controllers/crud.controller.js";
import { forecastService } from "./forecasts.service.js";
export const forecastController = createCrudController(forecastService);
