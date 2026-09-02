import { leadService } from "./lead.service.js";

const handle = (handler) => async (req, res, next) => {
  try {
    await handler(req, res);
  } catch (error) {
    next(error);
  }
};

export const leadController = {
  list: handle(async (req, res) => res.json(await leadService.list(req.query))),
  get: handle(async (req, res) =>
    res.json(await leadService.get(req.params.id)),
  ),
  create: handle(async (req, res) =>
    res.status(201).json(await leadService.create(req.validatedBody)),
  ),
  update: handle(async (req, res) =>
    res.json(await leadService.update(req.params.id, req.validatedBody)),
  ),
  remove: handle(async (req, res) => {
    await leadService.remove(req.params.id);
    res.status(204).end();
  }),
};
