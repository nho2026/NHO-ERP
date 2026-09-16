import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { resolveBackupTool } from "../src/modules/settings/backup-tool.js";

test("backup executable override supports paths containing spaces", async () => {
  const executable = "C:\\Custom MySQL\\bin\\mysqldump.exe";
  assert.equal(await resolveBackupTool({NHO_MYSQLDUMP_PATH: executable}, "win32"), executable);
  assert.equal(await resolveBackupTool({}, "linux"), "mysqldump");
});

test("Windows discovers MySQL outside PATH and prefers a PATH installation", async t => {
  const root = await mkdtemp(path.join(tmpdir(), "nho-backup-tool-"));
  t.after(() => rm(root, {recursive: true, force: true}));
  const bin = path.join(root, "MySQL", "MySQL Server 8.0", "bin");
  await mkdir(bin, {recursive: true});
  await writeFile(path.join(bin, "mysqldump.exe"), "");
  assert.equal(await resolveBackupTool({ProgramFiles: root}, "win32"), path.join(bin, "mysqldump.exe"));
  const custom = path.join(root, "custom");
  await mkdir(custom);
  await writeFile(path.join(custom, "mysqldump.exe"), "");
  assert.equal(await resolveBackupTool({ProgramFiles: root, PATH: custom}, "win32"), path.join(custom, "mysqldump.exe"));
});
