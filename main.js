const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const { autoUpdater } = require('electron-updater')
const path = require('path')
const url = require('url')
const startProxy = require('./proxy/index')
const CONFIG = require('./config')
const log = require('electron-log')
const deleteCache = require('./utils/deleteCacheFile')

autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'
log.info('App starting...')
// 保持一个对于 window 对象的全局引用，如果你不这样做，
// 当 JavaScript 对象被垃圾回收， window 会被自动地关闭
let win, configWin

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
    width: 360, height: 550, 
    parent: win, modal: true,
    icon: path.resolve(__dirname, './assets/icon.ico')
  })
  configWin.loadURL((url.format({
    pathname: path.join(__dirname, './renderer/win-config.html'),
    protocol: 'file:',
    slashes: true
  })))
})

const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
  if (win) {
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

if (shouldQuit) {
  app.quit()
}

function createWindow () {
  // 创建浏览器窗口。
  win = new BrowserWindow({
    width: 360, height: 200,
    icon: path.resolve(__dirname, './assets/icon.ico')
  })

  // 然后加载应用的 index.html。
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // 打开开发者工具。
  // win.webContents.openDevTools()

  // 当 window 被关闭，这个事件会被触发。
  win.on('closed', () => {
    // 取消引用 window 对象，如果你的应用支持多窗口的话，
    // 通常会把多个 window 对象存放在一个数组里面，
    // 与此同时，你应该删除相应的元素。
    win = null
  })

  autoUpdater.checkForUpdatesAndNotify()
  deleteCache(function (err) {
    if (err) console.error(err)
  })
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

function sendStatusToWindow(text) {
  log.info(text)
  win.webContents.send('message', text)
}

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...')
})

autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.')
})

autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.')
})

autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err)
})

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%'
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')'
  sendStatusToWindow(log_message)
})

autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded')
  dialog.showMessageBox(win, {
    type: 'question',
    buttons: ['更新', '稍后'],
    title: '应用更新',
    message: '有新的更新，需要重启工具，要现在安装吗？',
    cancelId: 1,
    defaultId: 0
  }, (response) => {
    if (response === 0) {
      app.quit()
    }
  })
})
