const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {

  getFornitori: (filterFornitori) => ipcRenderer.invoke('getFornitori', filterFornitori),
  addFornitori: (filterFornitori) => ipcRenderer.invoke('addFornitori', filterFornitori),
  updateFornitori: (id, data) => ipcRenderer.invoke('updateFornitori', id, data),
  deleteFornitori: (filterFornitori) => ipcRenderer.invoke('deleteFornitori', filterFornitori),
  
  getGestione: (filterGestione) => ipcRenderer.invoke('getGestione', filterGestione),
  addGestione: (filterGestione) => ipcRenderer.invoke('addGestione', filterGestione),
  updateGestione: (id, data) => ipcRenderer.invoke('updateGestione', id, data),
  deleteGestione: (filterGestione) => ipcRenderer.invoke('deleteGestione', filterGestione),
  
  getCosti: (filterCosti) => ipcRenderer.invoke('getCosti', filterCosti),
  addCosti: (filterCosti) => ipcRenderer.invoke('addCosti', filterCosti),
  updateCosti: (filterCosti) => ipcRenderer.invoke('updateCosti', filterCosti),
  deleteCosti: (filterCosti) => ipcRenderer.invoke('deleteCosti', filterCosti),

  getCostiFornitori: (filterFornitori, filterCosti) => ipcRenderer.invoke('getCostiFornitori', filterFornitori, filterCosti),
  addCostiFornitori: (data) => ipcRenderer.invoke('addCostiFornitori', data),
  updateCostiFornitori: (id, data) => ipcRenderer.invoke('updateCostiFornitori', id, data),
  deleteCostiFornitori: (id, season) => ipcRenderer.invoke('deleteCostiFornitori', id, season),

  getCostiGestione: (filterGestione, filterCosti) => ipcRenderer.invoke('getCostiGestione', filterGestione, filterCosti),
  addCostiGestione: (data) => ipcRenderer.invoke('addCostiGestione', data),
  updateCostiGestione: (id, data) => ipcRenderer.invoke('updateCostiGestione', id, data),
  deleteCostiGestione: (id, season) => ipcRenderer.invoke('deleteCostiGestione', id, season),


  getPreference: (key) => {
    return ipcRenderer.invoke('getPreference', key);
  },
  setPreference: (key, value) => {
    return ipcRenderer.invoke('setPreference', key, value);
  },
});
