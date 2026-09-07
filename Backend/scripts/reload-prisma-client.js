import { statSync, utimesSync } from "node:fs";

// node --watch does not reliably reload generated dependencies in node_modules.
// Touch the imported source module only after successful client generation.
const clientModule = new URL("../src/shared/database/prisma/client.js", import.meta.url);
const stat = statSync(clientModule);
utimesSync(clientModule, stat.atime, new Date());
console.log("Prisma client generated; notified the development server to reload.");
