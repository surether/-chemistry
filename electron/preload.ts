import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('dashboardApi', {
  readJson: (fileName: string): Promise<unknown> => ipcRenderer.invoke('dashboard:read-json', fileName),
  writeJson: (fileName: string, data: unknown): Promise<void> => ipcRenderer.invoke('dashboard:write-json', fileName, data),
  openTarget: (target: string, kind: 'url' | 'path'): Promise<void> => ipcRenderer.invoke('dashboard:open-target', target, kind),
  onOpenSettings: (callback: () => void): (() => void) => {
    const listener = (): void => callback();
    ipcRenderer.on('dashboard:open-settings', listener);
    return () => ipcRenderer.removeListener('dashboard:open-settings', listener);
  }
});
