import multer from "multer";
import path from "node:path";
import { mkdirSync } from "node:fs";
import { randomUUID } from "node:crypto";
const imageDirectory = path.resolve(process.cwd(), "public", "product-images");
mkdirSync(imageDirectory, { recursive: true });
export const upload = multer({
  storage: multer.diskStorage({
    destination: imageDirectory,
    filename: (_req, file, done) =>
      done(
        null,
        `${randomUUID()}${path.extname(file.originalname).toLowerCase() || ".jpg"}`,
      ),
  }),
  limits: { fileSize: 5 * 1024 * 1024, files: 8 },
  fileFilter: (_req, file, done) =>
    done(
      null,
      ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
        file.mimetype,
      ),
    ),
});
