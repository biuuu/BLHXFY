const { autoUpdater } = require('electron-updater')
const log = require('electron-log')
const { dialog } = require('electron')

autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'

module.exports = function (win) {
  let updateTimer = null

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
    clearInterval(updateTimer)
    dialog.showMessageBox(win, {
      type: 'question',
      buttons: ['更新', '稍后'],
      title: '应用更新',
      message: '有新的更新，需要重启工具，要现在安装吗？',
      cancelId: 1,
      defaultId: 0
    }, (response) => {
      if (response === 0) {
        autoUpdater.quitAndInstall()
      }
    })
  })

  autoUpdater.checkForUpdatesAndNotify()
  updateTimer = setInterval(() => {
    autoUpdater.checkForUpdatesAndNotify()
  }, 1000 * 60 * 60 * 24)
}
