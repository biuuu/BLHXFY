const ElementUI = require('element-ui')
const { ipcRenderer, shell, remote } = require('electron')
const ip = require('ip')
const path = require('path')
const deleteCache = require('../utils/deleteCacheFile')
const startServer = require('../utils/staticServer')
require('./form-config')
Vue.use(ElementUI)

const CSV_FOLDER_PATH = path.resolve(remote.app.getPath('userData'), 'local/*')
let staticLocalPath = path.resolve(remote.app.getPath('userData'), 'data/static/local/*')

let vueApp
let staticServer
ipcRenderer.on('config-data', (evt, data) => {
  vueApp.port = data.port
  vueApp.webPort = data.webPort
  vueApp.lang = data.lang
  const DATA_DIR_NAME = data.lang === 'hans' ? 'data' : 'data-hant'
  document.title = vueApp.uiText.title[data.lang]
  staticLocalPath = path.resolve(remote.app.getPath('userData'), `${DATA_DIR_NAME}/static/local/*`)
  if (!staticServer) {
    startServer(path.resolve(remote.app.getPath('userData'), DATA_DIR_NAME, 'static'), data.staticPort)
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
    downloading: false,
    lang: 'hans',
    uiText: {
      title: { hans: '碧蓝幻想翻译', hant: '碧藍幻想翻譯' },
      btnStart: { hans: '启动代理', hant: '啓動代理' },
      btnConfig: { hans: '修改配置', hant: '修改配置' },
      startTitle: { hans: '碧蓝幻想翻译启动！', hant: '碧藍幻想翻譯啓動！' },
      btnData: { hans: '打开数据目录', hant: '打開數據目錄' },
      btnStatic: { hans: '静态文件目录', hant: '靜態文件目錄' },
      btnGame: { hans: '开始游戏', hant: '開始游戲' },
      btnCookie: { hans: '清除Cookie', hant: '清除Cookie' },
      btnCache: { hans: '清除缓存', hant: '清除緩存' },
      loadData: { hans: '正在更新翻译数据包...', hant: '正在更新翻譯數據包...' }
    }
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
      shell.showItemInFolder(staticLocalPath)
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
