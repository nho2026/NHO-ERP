import "dotenv/config";

export const env = {
  port: Number(process.env.PORT ?? 4000),
  jwtSecret: process.env.JWT_SECRET ?? "development-only-secret",
  pinLookupSecret: process.env.PIN_LOOKUP_SECRET ?? "development-pin-secret",
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:5173",
  publicWebsiteUrls: (process.env.PUBLIC_WEBSITE_URLS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean),
  production: process.env.NODE_ENV === "production",
};
