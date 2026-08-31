import { app } from "./app.js";
import { createServer } from "node:http";
import { env } from "./config/environment.js";
import { prisma } from "./shared/database/client.js";
import {
  startAttendanceStreams,
  stopAttendanceStreams,
} from "./modules/attendance/events/events.live.js";
import { attachMeetingSignaling } from "./modules/meetings/meetings.signaling.js";

const server = createServer(app);
attachMeetingSignaling(
  server,
  [env.frontendUrl, ...env.publicWebsiteUrls],
  env.production,
);
server.listen(env.port, () =>
  console.log(`NHO API listening on http://localhost:${env.port}`),
);
startAttendanceStreams().catch((error) =>
  console.error("Attendance streams failed to start:", error),
);
const shutdown = async () => {
  stopAttendanceStreams();
  server.close();
  await prisma.$disconnect();
  process.exit(0);
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
