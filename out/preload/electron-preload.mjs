import { contextBridge, ipcRenderer } from "electron";
contextBridge.exposeInMainWorld("electron", {
  selectFolder: () => ipcRenderer.invoke("select-folder"),
  scanDirectory: (path) => ipcRenderer.invoke("scan-directory", path),
  executeCleanup: (moves) => ipcRenderer.invoke("execute-cleanup", moves)
});
