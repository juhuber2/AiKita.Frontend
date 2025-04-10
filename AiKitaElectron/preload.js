const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  savePerson: (name) => ipcRenderer.invoke('save-person', name),
  saveLog: (log) => ipcRenderer.invoke('save-log', log),
});