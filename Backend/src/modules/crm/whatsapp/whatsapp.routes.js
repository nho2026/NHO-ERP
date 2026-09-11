import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../../../shared/middleware/auth.middleware.js";
import { validate } from "../../../shared/middleware/validation.middleware.js";
import { whatsappService } from "./whatsapp.service.js";

const router = Router();
const handle = (handler) => async (req, res, next) => {
  try {
    await handler(req, res);
  } catch (error) {
    next(error);
  }
};
const canView = (req, res, next) =>
  req.permissionKeys.has("*") ||
  req.permissionKeys.has("employees.view") ||
  req.permissionKeys.has("employees.manage")
    ? next()
    : res.status(403).json({ message: "CRM access is required." });
const canManage = (req, res, next) =>
  req.permissionKeys.has("*") || req.permissionKeys.has("employees.manage")
    ? next()
    : res.status(403).json({ message: "CRM management access is required." });

router.get(
  "/webhook",
  handle(async (req, res) => {
    const challenge = whatsappService.verify(
      req.query["hub.mode"],
      req.query["hub.verify_token"],
      req.query["hub.challenge"],
    );
    res.status(200).send(challenge);
  }),
);
router.post(
  "/webhook",
  handle(async (req, res) => {
    await whatsappService.receive(req.body);
    res.sendStatus(200);
  }),
);
router.use(requireAuth);
router.get(
  "/status",
  canView,
  handle(async (_req, res) => res.json(whatsappService.status())),
);
router.get(
  "/conversations",
  canView,
  handle(async (_req, res) => res.json(await whatsappService.list())),
);
router.get(
  "/conversations/:id",
  canView,
  handle(async (req, res) =>
    res.json(await whatsappService.get(req.params.id)),
  ),
);
router.post(
  "/conversations/:id/messages",
  canManage,
  validate(z.object({ body: z.string().trim().min(1).max(4096) })),
  handle(async (req, res) =>
    res
      .status(201)
      .json(await whatsappService.send(req.params.id, req.validatedBody.body)),
  ),
);

export default router;
