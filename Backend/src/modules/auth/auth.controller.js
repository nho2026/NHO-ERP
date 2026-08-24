import { env } from "../../config/environment.js";
import { authService } from "./auth.service.js";

const handle = (handler) => async (req, res, next) => {
  try {
    await handler(req, res);
  } catch (error) {
    next(error);
  }
};
export const authController = {
  login: handle(async (req, res) => {
    const { user, token, remember } = await authService.login(
      req.validatedBody,
    );
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: env.production,
      sameSite: "lax",
      maxAge: remember ? 30 * 86400000 : 8 * 3600000,
      path: "/",
    });
    res.json({ user });
  }),
  me: (req, res) => res.json({ user: authService.present(req.user) }),
  profile: handle(async (req, res) =>
    res.json({ user: await authService.profile(req.user.id) }),
  ),
  updateProfile: handle(async (req, res) =>
    res.json({
      user: await authService.updateProfile(req.user.id, req.validatedBody),
    }),
  ),
  profileEvents: handle(async (req, res) =>
    res.json(await authService.profileEvents(req.user.id)),
  ),
  logout: (_req, res) => {
    res.clearCookie("access_token", { path: "/" });
    res.status(204).end();
  },
};
