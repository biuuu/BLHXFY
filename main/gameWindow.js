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
  ses.setUserAgent('Mozilla/5.0 (Linux; Android 6.0.1; Nexus 7 Build/MOB30X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3071.115 Safari/537.36')
  
  ipcMain.on('show-win-game', () => {
    ses.setProxy({
      pacScript: `http://127.0.0.1:${CONFIG.port}/pac`,
      proxyBypassRules: 'local'
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

    gameWin.loadURL('http://game.granbluefantasy.jp')
  })
}
