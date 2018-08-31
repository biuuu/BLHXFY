const fs = require('fs-extra')
const path = require('path')
const { app } = require('electron')
const mkdirp = require('mkdirp')

const { dirname } = path
const cwd = process.cwd()

const USER_DATA_PATH = app
  ? path.resolve(app.getPath('userData'))
  : path.resolve(cwd, 'userData')

const LOCAL_CONFIG_PATH = path.resolve(USER_DATA_PATH, 'config.json')

const config = {
  // 游戏的主要数据接口
  apiHostNames: ['game.granbluefantasy.jp', 'gbf.game.mbga.jp'],
  staticHostNames: [
    'game-a.granbluefantasy.jp', 'game-a1.granbluefantasy.jp', 'game-a2.granbluefantasy.jp', 'game-a3.granbluefantasy.jp', 'game-a4.granbluefantasy.jp', 'game-a5.granbluefantasy.jp',
    'gbf.game-a.mbga.jp', 'gbf.game-a1.mbga.jp', 'gbf.game-a2.mbga.jp', 'gbf.game-a3.mbga.jp', 'gbf.game-a4.mbga.jp', 'gbf.game-a5.mbga.jp'
  ],
  csvHost: "blhx.danmu9.com",
  // 是否启用剧情翻译
  transScenario: true,
  // 否启用界面翻译
  transUi: true,
  // 替换用的主角名字
  yourName: '姬塔',
  displayName: '',
  lang: 'auto',
  // 是否拦截 http://platform.twitter.com/widgets.js
  interceptTwitterWidgets: true,

  // 自动更新翻译数据包
  autoUpdate: true,

  // 本地代理的端口
  port: 8001,
  webInterface: true,  // 是否启用 anyProxy 的 web 界面
  webPort: 8002,    // anyProxy 的 web 界面端口

  // 是否启用静态文件 http 服务
  staticServer: false,
  staticPort: 8003,

  // 是否解析 https 请求
  proxyHttps: false,

  // 是否使用前置代理
  frontAgent: false,
  frontAgentHost: '127.0.0.1',
  frontAgentPort: 1080,

  gameWindow: {
    width: 465, height: 750,
    frame: true, alwaysOnTop: false,
    top: 50, left: 50
  },

  transService: 'google',
  baidu: {
    appid: '',
    appSecret: ''
  },
  youdao: {
    appKey: '',
    appSecret: ''
  }
}

const getLocalConfig = () => {
  const localConfig = fs.readJsonSync(LOCAL_CONFIG_PATH, { throws: false })
  if (localConfig && localConfig.staticHostNames && !localConfig.staticHostNames.includes('game-a5.granbluefantasy.jp')) {
    localConfig.staticHostNames = config.staticHostNames
  }
  Object.assign(config, localConfig)
  if (config.lang === 'auto') {
    config.lang = app && (app.getLocale() === 'zh-TW') ? 'hant' : 'hans'
  }
  fs.ensureFileSync(LOCAL_CONFIG_PATH)
  fs.writeJsonSync(LOCAL_CONFIG_PATH, config, { spaces: 2 })
}

getLocalConfig()

module.exports = config
