const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const { session } = require('electron')
const { default: installExtension } = require('electron-devtools-installer')

module.exports = () => {
  installExtension('fgpokpknehglcioijejfeebigdnbnokj')
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err))
  const ses = session.fromPartition('persist:blhxfy')
  // ses.setUserAgent('Mozilla/5.0 (Linux; Android 6.0.1; Nexus 7 Build/MOB30X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3071.115 Safari/537.36')
  ipcMain.on('show-win-game', () => {
    gameWin = new BrowserWindow({
      width: 360, height: 590,
      icon: path.resolve(__dirname, '../assets/icon.ico'),
      frame: false,
      alwaysOnTop: true,
      webPreferences: {
        preload: path.resolve(__dirname, './preload.js'),
        nodeIntegration: false,
        session: ses,
        plugins: true
      }
    })

    gameWin.loadURL('http://game.granbluefantasy.jp')
  })
}
