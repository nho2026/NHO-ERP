import { app } from "./app.js";
import { env } from "./config/environment.js";
import { prisma } from "./shared/database/client.js";

const server = app.listen(env.port, () =>
  console.log(`NHO API listening on http://localhost:${env.port}`),
);
const shutdown = async () => {
  server.close();
  await prisma.$disconnect();
  process.exit(0);
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
