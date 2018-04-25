const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const { session } = require('electron')

module.exports = () => {
  const ses = session.fromPartition('persist:blhxfy')
  ses.setUserAgent('Mozilla/5.0 (Linux; Android 6.0.1; Nexus 7 Build/MOB30X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36')
  ipcMain.on('show-win-game', () => {
    gameWin = new BrowserWindow({
      width: 360, height: 590,
      icon: path.resolve(__dirname, '../assets/icon.ico'),
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
