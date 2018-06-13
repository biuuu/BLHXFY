const setTrayIcon = require('./setTrayIcon')
const path = require('path')
const url = require('url')
const startProxy = require('../proxy/index')
const CONFIG = require('../config')
const log = require('electron-log')
const deleteCache = require('../utils/deleteCacheFile')
const checkCsvUpdate = require('../utils/updateCsv')
const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const autoUpdate = require('./autoUpdate')
const initGameWindow = require('./gameWindow')

let win, configWin

const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
  if (win) {
    if (win.isMinimized()) win.restore()
    win.isVisible() ? null : win.show()
    win.focus()
  }
})

const start = () => {
  log.info('App starting...')

  ipcMain.on('update-config', (event, data) => {
    Object.assign(CONFIG, data)
  })

  ipcMain.on('start-proxy', (event, data) => {
    win.webContents.send('config-data', CONFIG)
    startProxy()
    win.setSize(360, 300)
  })

  ipcMain.on('show-win-config', () => {
    configWin = new BrowserWindow({
      width: 660, height: 310,
      parent: win, modal: true,
      icon: path.resolve(__dirname, '../assets/icon.ico')
    })
    configWin.loadURL((url.format({
      pathname: path.join(__dirname, '../renderer/win-config.html'),
      protocol: 'file:',
      slashes: true
    })))
  })

  ipcMain.on('app-version', () => {
    win.webContents.send('app-version', app.getVersion())
  })

  function createWindow () {
    // 创建浏览器窗口。
    win = new BrowserWindow({
      width: 360, height: 200,
      icon: path.resolve(__dirname, '../assets/icon.ico')
    })

    // 然后加载应用的 index.html。
    win.loadURL(url.format({
      pathname: path.join(__dirname, '../renderer/index.html'),
      protocol: 'file:',
      slashes: true
    }))

    // 当 window 被关闭，这个事件会被触发。
    win.on('closed', () => {
      // 取消引用 window 对象，如果你的应用支持多窗口的话，
      // 通常会把多个 window 对象存放在一个数组里面，
      // 与此同时，你应该删除相应的元素。
      win = null
    })

    initGameWindow()

    setTrayIcon(win)

    autoUpdate(win)

    deleteCache(function (err) {
      if (err) console.error(`${err.message}\n${err.stack}`)
    })

    if (CONFIG.autoUpdate) {
      checkCsvUpdate(win)
    }
  }

  // Electron 会在初始化后并准备
  // 创建浏览器窗口时，调用这个函数。
  // 部分 API 在 ready 事件触发后才能使用。
  app.on('ready', createWindow)

  // 当全部窗口关闭时退出。
  app.on('window-all-closed', () => {
    // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
    // 否则绝大部分应用及其菜单栏会保持激活。
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', () => {
    // 在macOS上，当单击dock图标并且没有其他窗口打开时，
    // 通常在应用程序中重新创建一个窗口。
    if (win === null) {
      createWindow()
    }
  })
}

if (shouldQuit) {
  app.quit()
} else {
  start()
}
