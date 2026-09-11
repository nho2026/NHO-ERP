import "dotenv/config";

export const env = {
  port: Number(process.env.PORT ?? 4000),
  jwtSecret: process.env.JWT_SECRET ?? "development-only-secret",
  pinLookupSecret: process.env.PIN_LOOKUP_SECRET ?? "development-pin-secret",
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:3000",
  publicWebsiteUrls: (process.env.PUBLIC_WEBSITE_URLS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean),
  production: process.env.NODE_ENV === "production",
  whatsapp: {
    verifyToken: process.env.WHATSAPP_VERIFY_TOKEN ?? "",
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN ?? "",
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID ?? "",
    graphVersion: process.env.WHATSAPP_GRAPH_VERSION ?? "v26.0",
  },
};
