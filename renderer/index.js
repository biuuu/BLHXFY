const ElementUI = require('element-ui')
const { ipcRenderer, shell, remote } = require('electron')
const ip = require('ip')
const path = require('path')
const deleteCache = require('../utils/deleteCacheFile')
require('./form-config')
Vue.use(ElementUI)

const CSV_FOLDER_PATH = path.resolve(remote.app.getPath('userData'), 'local/*')
const STATIC_FOLDER_PATH = path.resolve(remote.app.getPath('userData'), 'static/local/*')

let vueApp
ipcRenderer.on('config-data', (evt, data) => {
  vueApp.port = data.port
  vueApp.webPort = data.webPort
})

ipcRenderer.on('app-version', (evt, data) => {
  vueApp.version = data
})

setInterval(() => {
  deleteCache(function (err) {
    if (err) console.error(err)
  }, true)
}, 1000 * 60 * 60)

vueApp = new Vue({
  el: '#app',
  data: {
    started: false,
    port: 8001,
    webPort: 8002,
    ip: ip.address(),
    version: null
  },
  beforeMount () {
    ipcRenderer.send('app-version')
  },
  methods: {
    openConfigWin () {
      ipcRenderer.send('show-win-config')
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