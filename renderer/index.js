const ElementUI = require('element-ui')
const { ipcRenderer, shell, remote } = require('electron')
const ip = require('ip')
const path = require('path')
const deleteCache = require('../utils/deleteCacheFile')
const startServer = require('../utils/staticServer')
require('./form-config')
Vue.use(ElementUI)

const CSV_FOLDER_PATH = path.resolve(remote.app.getPath('userData'), 'local/*')
const STATIC_FOLDER_PATH = path.resolve(remote.app.getPath('userData'), 'static/local/*')

let vueApp
let staticServer
ipcRenderer.on('config-data', (evt, data) => {
  vueApp.port = data.port
  vueApp.webPort = data.webPort
  if (!staticServer) {
    startServer(path.resolve(remote.app.getPath('userData'), 'data', 'static'), data.staticPort)
    staticServer = 'on'
  }
})

ipcRenderer.on('app-version', (evt, data) => {
  vueApp.version = data
})

ipcRenderer.on('update-csv', (evt, status) => {
  vueApp.downloading = status
})

setInterval(() => {
  deleteCache(function (err) {
    if (err) console.error(`${err.message}\n${err.stack}`)
  }, true)
}, 1000 * 60 * 60)

vueApp = new Vue({
  el: '#app',
  data: {
    started: false,
    port: 8001,
    webPort: 8002,
    ip: ip.address(),
    version: null,
    downloading: false
  },
  beforeMount () {
    ipcRenderer.send('app-version')
  },
  methods: {
    openConfigWin () {
      ipcRenderer.send('show-win-config')
    },
    openWhat (type) {
      if (type === 'static') {
        this.openStaticFolder()
      }
    },
    clearWhat (type) {
      if (type === 'cache') {
        ipcRenderer.send('clear-game-window', 'cache')
      } else if (type === 'cookie') {
        ipcRenderer.send('clear-game-window', 'cookie')
      }
    },
    openGameWin () {
      ipcRenderer.send('show-win-game')
    },
    openCsvFolder () {
      shell.showItemInFolder(CSV_FOLDER_PATH)
    },
    openStaticFolder () {
      shell.showItemInFolder(STATIC_FOLDER_PATH)
    },
    openProxyWeb () {
      shell.openExternal(`http://localhost:${this.webPort}`)
    },
    startProxy () {
      ipcRenderer.send('start-proxy')
      this.started = true
    }
  }
})
