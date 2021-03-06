'use strict'

import { app, protocol, BrowserWindow,Menu } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
 import { autoUpdater } from "electron-updater"
const path = require('path')
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: true,
       contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    }
  }) 

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  process.env.GH_TOKEN ="23ea2e1483771246bd686002b7b1ffeb08da9bed";

  setInterval(() => {
    autoUpdater.checkForUpdates()
}, 60000)
  }
  // mainWindow.once('ready-to-show', () => {
  //   autoUpdater.checkForUpdatesAndNotify();
  // });
//   autoUpdater.autoDownload = false;
// autoUpdater.checkForUpdates();

}
autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  const dialogOpts = {
      type: 'info',
      buttons: ['Restart', 'Not Now. On next Restart'],
      title: 'Update',
      message: process.platform === 'win32' ? releaseNotes : releaseName,
      detail: 'A New Version has been Downloaded. Restart Now to Complete the Update.'
  }

  dialog.showMessageBox(dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) autoUpdater.quitAndInstall()
  })
})

autoUpdater.on('error', message => {
  console.error('There was a problem updating the application')
  console.error(message)
})
// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
const template =[
  {
   
    role:'reload'
  }
]
const myAppMenu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(myAppMenu)
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// autoUpdater.on("update-available", () => {
  
//   win.webContents.send("update_available", "update_available");
// });
// autoUpdater.on("update-not-available", () => {
  
//   win.webContents.send("updater", "update_not_available");
// });
// autoUpdater.on('update-downloaded', () => {
//   mainWindow.webContents.send('update_downloaded');
// });
// ipcMain.on('restart_app', () => {
//   autoUpdater.quitAndInstall();
// });
// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
