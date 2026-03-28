const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getTempDir: () => ipcRenderer.invoke('get-temp-dir'),
  saveAudioFile: (fileName, buffer) => ipcRenderer.invoke('save-audio-file', { fileName, buffer }),
  readAudioFile: (filePath) => ipcRenderer.invoke('read-audio-file', filePath),
  deleteAudioFile: (filePath) => ipcRenderer.invoke('delete-audio-file', filePath)
});
