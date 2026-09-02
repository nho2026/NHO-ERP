import {
  pageResult,
  paginationArgs,
} from "../../shared/pagination/pagination.js";
import { crmModel } from "./crm.model.js";

export const crmService = {
  lookups: () => crmModel.lookups(),
  async list(resource, query) {
    const { page, pageSize, skip, take } = paginationArgs(query);
    const [items, total] = await crmModel.list(resource, skip, take);
    return pageResult(items, total, page, pageSize);
  },
  create: (resource, data) => crmModel.create(resource, data),
  update: (resource, id, data) => crmModel.update(resource, id, data),
  delete: (resource, id) => crmModel.delete(resource, id),
};
