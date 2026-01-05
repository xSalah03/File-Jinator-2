
import { contextBridge, ipcRenderer } from 'electron';
import { FileMove } from '../shared/types';

contextBridge.exposeInMainWorld('electron', {
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  scanDirectory: (path: string) => ipcRenderer.invoke('scan-directory', path),
  executeCleanup: (moves: FileMove[]) => ipcRenderer.invoke('execute-cleanup', moves),
});
