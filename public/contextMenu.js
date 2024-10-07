const { Menu } = require('electron');

const contextMenu = (win) => {
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Ispeziona',
      click: () => {
        win.webContents.openDevTools({ mode: 'right' }); // Apre gli strumenti di sviluppo affiancati a destra
      }
    },
    {
      label: 'Ricarica',
      click: () => {
        win.reload();
      }
    }
  ]);

  // Mostra il menu contestuale al click destro
  win.webContents.on('context-menu', (e, params) => {
    contextMenu.popup(win, params.x, params.y);
  });
};

module.exports = contextMenu;
