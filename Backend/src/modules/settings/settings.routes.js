import { Router } from "express";
import { requireAuth } from "../../shared/middleware/auth.middleware.js";
import { allSettings, saveSettings, isSuperAdmin, getSettings } from "./settings.service.js";
import { createBackup, listBackups } from "./settings.backups.js";
const router = Router();
const run = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res)).catch(next);
router.get(
  "/logo",
  run(async (_req, res) => {
    const { logo } = await getSettings("organization");
    res.set("Cache-Control", "no-store").json({ logo });
  }),
);
router.use(requireAuth);
router.get(
  "/",
  run(async (_req, res) => res.json(await allSettings())),
);
const admin = (req, res, next) =>
  isSuperAdmin(req.user)
    ? next()
    : res
      .status(403)
      .json({
        message: "Only a Super Administrator can change system settings.",
      });
router.get(
  "/backups",
  admin,
  run(async (_req, res) => res.json(await listBackups())),
);
router.post(
  "/backups",
  admin,
  run(async (_req, res) => res.status(201).json(await createBackup())),
);
router.put(
  "/:category",
  admin,
  run(async (req, res) =>
    res.json(await saveSettings(req.params.category, req.body)),
  ),
);
export default router;
