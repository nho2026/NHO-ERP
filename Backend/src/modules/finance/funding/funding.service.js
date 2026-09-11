import { fundingModel as model } from "./funding.model.js";
export const fundingService = {
  list: (q) =>
    model.findPage(
      Number(q.page) || 1,
      Math.min(100, Math.max(50, Number(q.pageSize) || 50)),
    ),
  create: model.create,
  update: model.update,
  remove: model.remove,
};
