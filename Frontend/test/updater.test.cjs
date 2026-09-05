const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const { EventEmitter } = require("node:events");
const path = require("node:path");
function harness(packaged = true) {
  const handlers = new Map();
  const updater = new EventEmitter();
  let installed = 0,
    checked = 0,
    downloaded = 0;
  updater.checkForUpdates = async () => {
    checked++;
  };
  updater.downloadUpdate = async () => {
    downloaded++;
  };
  updater.quitAndInstall = () => {
    installed++;
  };
  const frame = { url: "file:///app/dist/index.html" };
  const event = { senderFrame: frame, sender: { mainFrame: frame } };
  const electron = {
    app: {
      isPackaged: packaged,
      getVersion: () => "1.0.0",
      getPath: () => "/tmp",
    },
    ipcMain: { handle: (name, fn) => handlers.set(name, fn) },
    BrowserWindow: { fromWebContents: () => ({}), getAllWindows: () => [] },
    dialog: { showMessageBox: async () => ({ response: 1 }) },
  };
  const module = { exports: {} };
  const sandbox = {
    URL,
    module,
    __dirname: "/app/electron",
    process: { resourcesPath: "/app/resources", env: {} },
    setInterval: () => ({ unref() {} }),
    setTimeout: () => ({ unref() {} }),
    require: (name) =>
      name === "electron"
        ? electron
        : name === "electron-updater"
          ? { autoUpdater: updater }
          : name === "node:fs"
            ? {
                existsSync: () => true,
                readFileSync: () => '{"automatic":false}',
                writeFileSync: () => {},
              }
            : require(name),
  };
  vm.runInNewContext(
    fs.readFileSync(path.join(__dirname, "../electron/updater.cjs"), "utf8"),
    sandbox,
  );
  module.exports.setupUpdater();
  return {
    updater,
    event,
    call: (name, ...args) => handlers.get("updater:" + name)(event, ...args),
    counts: () => ({ installed, checked, downloaded }),
  };
}
test("updater requires availability before download and readiness before installation", async () => {
  const h = harness();
  await h.call("download");
  await h.call("install");
  assert.deepEqual(h.counts(), { installed: 0, checked: 0, downloaded: 0 });
  h.updater.emit("update-available", {
    version: "1.1.0",
    releaseNotes: "Changes",
  });
  await h.call("download");
  assert.equal(h.counts().downloaded, 1);
  h.updater.emit("update-downloaded");
  await h.call("meeting", true);
  await h.call("install");
  assert.equal(h.counts().installed, 0);
  await h.call("meeting", false);
  await h.call("install");
  assert.equal(h.counts().installed, 1);
});
test("development builds do not check releases", async () => {
  const h = harness(false);
  h.event.senderFrame.url = "http://localhost:3000/";
  await h.call("check");
  assert.equal(h.counts().checked, 0);
});
test("untrusted renderer URLs cannot invoke update actions", async () => {
  const h = harness();
  h.event.senderFrame.url = "https://untrusted.example";
  await assert.rejects(h.call("check"), /Unavailable sender/);
  assert.equal(h.counts().checked, 0);
});
