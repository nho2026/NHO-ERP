import { forecastModel as model } from "./forecasts.model.js";
export const forecastService = {
  list: (q) =>
    model.findPage(
      Number(q.page) || 1,
      Math.min(100, Math.max(50, Number(q.pageSize) || 50)),
    ),
  create: model.create,
  update: model.update,
  remove: model.remove,
};
