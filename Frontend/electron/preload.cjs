const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronWindow", {
  minimize: () => ipcRenderer.send("window:minimize"),
  toggleMaximize: () => ipcRenderer.send("window:toggle-maximize"),
  close: () => ipcRenderer.send("window:close"),
  showNotification: (notification) =>
    ipcRenderer.send("notification:show", notification),
  onNotificationClick: (callback) => {
    const listener = (_event, route) => callback(route);
    ipcRenderer.on("notification:clicked", listener);
    return () => ipcRenderer.removeListener("notification:clicked", listener);
  },
  openMediaSettings: (kind) =>
    ipcRenderer.invoke("permissions:open-media-settings", kind),
});
