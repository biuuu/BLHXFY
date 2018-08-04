const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const { debounce } = require('lodash')
const { session } = require('electron')
const { saveConfig } = require('../utils/')
const CONFIG = require('../config')
const OPTION = CONFIG.gameWindow || {}

const debcSaveConfig = debounce(saveConfig, 3000)

module.exports = () => {
  // installExtension('fgpokpknehglcioijejfeebigdnbnokj')
  //   .then((name) => console.log(`Added Extension:  ${name}`))
  //   .catch((err) => console.log('An error occurred: ', err))
  let gameWin = null
  const ses = session.fromPartition('persist:gameWindow')
  ses.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1')

  ipcMain.on('clear-game-window', (event, type) => {
    if (type === 'cache') {
      ses.clearCache(() => console.log('cache cleared'))
    } else if (type === 'cookie') {
      ses.clearStorageData({
        storages: ['cookies']
      }, () => console.log('cookies cleared'))
    }
  })

  ipcMain.on('show-win-game', () => {
    ses.setProxy({
      pacScript: `http://127.0.0.1:${CONFIG.port}/pac`
    }, function () {

    })

    gameWin = new BrowserWindow({
      width: OPTION.width, height: OPTION.height,
      x: OPTION.left, y: OPTION.top,
      icon: path.resolve(__dirname, '../assets/game.ico'),
      frame: OPTION.frame,
      alwaysOnTop: OPTION.alwaysOnTop,
      webPreferences: {
        preload: path.resolve(__dirname, './preload.js'),
        nodeIntegration: false,
        session: ses
      }
    })

    gameWin.webContents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures) => {
      event.preventDefault()
      Object.assign(options, {
        webPreferences: Object.assign(options.webPreferences, {
          session: ses
        })
      })
      const win = new BrowserWindow(options)
      event.newGuest = win
      win.loadURL(url)
    })

    gameWin.webContents.on('before-input-event', (event, input) => {
      if (input.key.toLowerCase() === 'y' && input.control && input.shift) {
        gameWin.webContents.openDevTools()
      }
      if (input.key.toLowerCase() === 'r' && input.control) {
        gameWin.reload()
      }
    })

    gameWin.on('resize', function () {
      const [width, height] = gameWin.getSize()
      OPTION.width = width
      OPTION.height = height
      debcSaveConfig(CONFIG)
    })

    gameWin.on('move', function () {
      const [x, y] = gameWin.getPosition()
      OPTION.left = x
      OPTION.top = y
      debcSaveConfig(CONFIG)
    })

    gameWin.on('closed', function () {
      gameWin = null
    })

    gameWin.loadURL('http://game.granbluefantasy.jp/#mypage')
  })
}
