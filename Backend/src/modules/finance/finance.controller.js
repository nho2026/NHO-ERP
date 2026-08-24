import { analysisQuerySchema } from "./finance.schema.js";
import { financeService } from "./finance.service.js";
export const financeController = {
  async analysis(req, res, next) {
    try {
      res.json(
        await financeService.analysis(
          analysisQuerySchema.parse(req.query).year,
        ),
      );
    } catch (error) {
      next(error);
    }
  },
};
