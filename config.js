const fs = require('fs')
const path = require('path')
const { dirname } = require('path')
const mkdirp = require('mkdirp')

const config = {
  // 游戏的主要数据接口
  apiHostNames: ['game.granbluefantasy.jp', 'gbf.game.mbga.jp'],
  // 是否启用剧情翻译
  transScenario: true,
  // 是否启用常见短语翻译
  transPhrase: false,
  // 是否替换主角名字，不替换留空
  yourName: '姬塔',
  // 是否拦截 http://platform.twitter.com/widgets.js
  interceptTwitterWidgets: true,

  // 本地代理的端口
  port: 9200,
  webInterface: true,  // 是否启用 anyProxy 的 web 界面
  webPort: 9201,    // anyProxy 的 web 界面端口

  // 是否解析 https 请求
  proxyHttps: false,

  // 是否使用前置代理
  frontAgent: false,
  frontAgentHost: '127.0.0.1',
  frontAgentPort: 1080
}

const LOCAL_CONFIG_PATH = path.resolve(process.cwd(), 'local', 'config.json')

const getLocalConfig = () => {
  let localConfig = {}
  try {
    const buffer = fs.readFileSync(LOCAL_CONFIG_PATH)
    localConfig = JSON.parse(buffer.toString())
  } catch (err) {
    if (err.code === 'ENOENT') {
      mkdirp(dirname(LOCAL_CONFIG_PATH), (err) => {
        if (err) return
        fs.writeFileSync(LOCAL_CONFIG_PATH, JSON.stringify(config, null, 2))
      })
    }
  }

  Object.assign(config, localConfig)
}

getLocalConfig()

module.exports = config
