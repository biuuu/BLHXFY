const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const { session } = require('electron')

module.exports = () => {
  const ses = session.fromPartition('persist:blhxfy')
  ses.setUserAgent('Mozilla/5.0 (Linux; Android 6.0.1; Nexus 7 Build/MOB30X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36')
  ses.setProxy({
    proxyRules: 'http=127.0.0.1:8001'
  }, () => {})
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
    // gameWin.webContents.on('new-window', function(e, url) {
    //   e.preventDefault()
    //   const win = new BrowserWindow({
    //     width: 360, height: 590,
    //     icon: path.resolve(__dirname, '../assets/icon.ico'),
    //     frame: false,
    //     webPreferences: {
    //       preload: path.resolve(__dirname, './preload.js'),
    //       nodeIntegration: false,
    //       session: ses,
    //       plugins: true
    //     }
    //   })
    //   win.loadURL(url)
    //   e.newGuest = win
    // })
    gameWin.loadURL('http://gbf.game.mbga.jp')
  })
}
