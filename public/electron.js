const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const contextMenu = require('./contextMenu');
require('dotenv').config();
const { getCostiFornitori, addCostiFornitori, updateCostiFornitori, deleteCostiFornitori } = require('./API/CostiFornitoriAPI');
const { getCostiGestione, addCostiGestione, updateCostiGestione, deleteCostiGestione } = require('./API/CostiGestioneAPI');
const { getCosti, addCosti, updateCosti, deleteCosti } = require('./API/CostiAPI');
const { getFornitori, addFornitori, updateFornitori, deleteFornitori } = require('./API/FornitoriAPI');
const { getGestione, addGestione, updateGestione, deleteGestione } = require('./API/GestioneAPI');
const { loadPreferences } = require('./API/LoadPreferencesAPI');
const { savePreferences } = require('./API/SavePreferencesAPI');

let win;

let isDev = process.env.NODE_ENV === 'development';
if (isDev) {
  require('electron-reload')(path.join(__dirname, '../build'), {
    electron: require(`${__dirname}/../node_modules/electron`),
    awaitWriteFinish: true,
  });
}

function createWindow() {

  win = new BrowserWindow({
    height: 800,
    width: 1200,
    minHeight: 800,
    minWidth: 1200,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      enableRemoteModule: true
    },
    icon: path.join(__dirname, 'favicon.ico'),
    title: 'Ciane 13 Manager',
  });



  const startUrl = isDev ?
    'http://localhost:3000' :
    path.join(`file://${path.join(__dirname, "../build/index.html")}`);


  win.loadURL(startUrl);
  // win.webContents.openDevTools();
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  contextMenu(win); //Menu tasto destro
  Menu.setApplicationMenu(null); //Barra degli strumenti, null per nasconderlo

}
app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

//------------------------------------------------------------------------------------

ipcMain.handle('getPreference', async (event, key) => {
  const preferences = loadPreferences();
  return preferences[key];
});

ipcMain.handle('setPreference', async (event, key, value) => {
  const preferences = loadPreferences();
  preferences[key] = value;
  savePreferences(preferences);
});

ipcMain.handle('getFornitori', async (event, filterFornitori) => {
  return new Promise((resolve, reject) => {
    getFornitori((err, data) => {
      if (err) {
        console.error('Error in getFornitori:', err);
        reject(err);
      } else {
        resolve(data);
      }
    });
  }, filterFornitori);
});

ipcMain.handle('addFornitori', async (event, data) => {
  return new Promise((resolve, reject) => {
    addFornitori(data, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
});

ipcMain.handle('updateFornitori', async (event, id, data) => {
  return new Promise((resolve, reject) => {
    updateFornitori(id, data, (err, result) => {
      if (err) {
        console.error('Error in updateFornitori:', err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
});

ipcMain.handle('deleteFornitori', async (event, id) => {
  return new Promise((resolve, reject) => {
    deleteFornitori(id, (err, result) => {
      if (err) {
        console.error('Error in deleteFornitori:', err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
});


ipcMain.handle('getGestione', async (event, filterGestione) => {
  return new Promise((resolve, reject) => {
    getGestione((err, data) => {
      if (err) {
        console.error('Error in getGestione:', err);
        reject(err);
      } else {
        resolve(data);
      }
    });
  }, filterGestione);
});

ipcMain.handle('addGestione', async (event, data) => {
  return new Promise((resolve, reject) => {
    addGestione(data, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
});

ipcMain.handle('updateGestione', async (event, id, data) => {
  return new Promise((resolve, reject) => {
    updateGestione(id, data, (err, result) => {
      if (err) {
        console.error('Error in updateGestione:', err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
});

ipcMain.handle('deleteGestione', async (event, id) => {
  return new Promise((resolve, reject) => {
    deleteGestione(id, (err, result) => {
      if (err) {
        console.error('Error in deleteGestione:', err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
});


ipcMain.handle('getCosti', async (event, filterCosti) => {
  try {
    const data = await new Promise((resolve, reject) => {
      getCosti((err, data) => {
        if (err) {
          console.error('Error in getCosti:', err);
          reject(err);
        } else {
          resolve(data);
        }
      }, filterCosti);
    });
    return data;
  } catch (err) {
    throw err;
  }
});

ipcMain.handle('addCosti', async (event, data) => {
  return new Promise((resolve, reject) => {
    addCosti(data, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
});

ipcMain.handle('updateCosti', async (event, id, data) => {
  return new Promise((resolve, reject) => {
    updateCosti(id, data, (err, result) => {
      if (err) {
        console.error('Error in updateCosti:', err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
});

ipcMain.handle('deleteCosti', async (event, id) => {
  return new Promise((resolve, reject) => {
    deleteCosti(id, (err, result) => {
      if (err) {
        console.error('Error in deleteCosti:', err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
});


ipcMain.handle('getCostiFornitori', async (event, filterCosti, filterFornitori) => {
  return new Promise((resolve, reject) => {
    getCostiFornitori((err, data) => {
      if (err) {
        console.error('Error in getCostiFornitori:', err);
        reject(err);
      } else {
        resolve(data);
      }
    }, filterCosti, filterFornitori);
  });
});

ipcMain.handle('addCostiFornitori', async (event, data) => {
  return new Promise((resolve, reject) => {
    addCostiFornitori(data, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
});

ipcMain.handle('updateCostiFornitori', async (event, id, data) => {
  return new Promise((resolve, reject) => {
    updateCostiFornitori(id, data, (err, result) => {
      if (err) {
        console.error('Error in updateCostiFornitori:', err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
});

ipcMain.handle('deleteCostiFornitori', async (event, id, season) => {
  return new Promise((resolve, reject) => {
    deleteCostiFornitori(id, season, (err, result) => {
      if (err) {
        console.error('Error in deleteCostiFornitori:', err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
});


ipcMain.handle('getCostiGestione', async (event, filterCosti, filterGestione) => {
  return new Promise((resolve, reject) => {
    getCostiGestione((err, data) => {
      if (err) {
        console.error('Error in getCostiGestione:', err);
        reject(err);
      } else {
        resolve(data);
      }
    }, filterCosti, filterGestione);
  });
});

ipcMain.handle('addCostiGestione', async (event, data) => {
  return new Promise((resolve, reject) => {
    addCostiGestione(data, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
});

ipcMain.handle('updateCostiGestione', async (event, id, data) => {
  return new Promise((resolve, reject) => {
    updateCostiGestione(id, data, (err, result) => {
      if (err) {
        console.error('Error in updateCostiGestione:', err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
});

ipcMain.handle('deleteCostiGestione', async (event, id, season) => {
  return new Promise((resolve, reject) => {
    deleteCostiGestione(id, season, (err, result) => {
      if (err) {
        console.error('Error in deleteCostiGestione:', err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
});
