const ElementUI = require('element-ui')
const { ipcRenderer, shell } = require('electron')
const ip = require('ip')
const path = require('path')
require('./form-config')
Vue.use(ElementUI)

const CSV_FOLDER_PATH = path.resolve(process.cwd(), 'local/*')
let app
ipcRenderer.on('config-data', (evt, data) => {
  app.port = data.port
  app.webPort = data.webPort
})

app = new Vue({
  el: '#app',
  data: {
    started: false,
    port: 8001,
    webPort: 8002,
    ip: ip.address()
  },
  methods: {
    openConfigWin () {
      ipcRenderer.send('show-win-config')
    },
    openCsvFolder () {
      shell.showItemInFolder(CSV_FOLDER_PATH)
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