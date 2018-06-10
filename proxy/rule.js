const parseScenario = require('../modules/translate/scenario')
const parsePhrase = require('../modules/translate/phrase')
const parseNewquest = require('../modules/translate/new-quest')
const { getUserInfo, getUserName } = require('../modules/info/user')
const { transUI } = require('../modules/translate/ui-css')
const CONFIG = require('../config.js')
const URI = require('urijs')
const { processResponseBody } = require('../utils/')
const users = require('../store/users')
const { staticMap } = require('../store/staticMap')
const getPac = require('./pac')

const apiHostNames = CONFIG.apiHostNames
const staticHostNames = CONFIG.staticHostNames

const searchSomething = (responseDetail, uri) => {
  const body = responseDetail.response.body.toString()

  return responseDetail
}

const processData = (handler, errMsg, isJson = true) => async (res, uid, pathname) => {
  try {
    return await processResponseBody({
      res, handler, uid, pathname, isJson
    })
  } catch (e) {
    console.error(`${errMsg}::${e}\n${e.stack}`)
    return null
  }
}

const scenarioProcess = processData(parseScenario, '翻译剧情遇到问题')
const phraseProcess = processData(parsePhrase, '翻译langMsg遇到问题')
const newquestProcess = processData(parseNewquest, '翻译下一章弹窗遇到问题')

module.exports = {
  *beforeSendRequest(requestDetail) {
    const newRequestOptions = requestDetail.requestOptions
    if (!newRequestOptions.hostname) {
      if (newRequestOptions.path === '/' || newRequestOptions.path === '/favicon.ico') {
        return { response: { statusCode: 200, header: {}, body: 'started' } }
      }
      if (newRequestOptions.path === '/pac') {
        return { response: { statusCode: 200, header: {}, body: getPac(CONFIG)} }
      }
    }

    const uri = URI(requestDetail.url)
    const pathname = uri.pathname()
    const hostname = uri.hostname()
    const query = uri.search(true)
    if (CONFIG.interceptTwitterWidgets && requestDetail.url === 'http://platform.twitter.com/widgets.js') {
      return { response: { statusCode: 200, header: {}, body: '' } }
    }

    // 数据接口
    if (apiHostNames.includes(hostname)) {
      if (pathname === '/rest/sound/btn_se') {
        const user = users.get(query.uid)
        if (user && !user.name) {
          newRequestOptions.path = newRequestOptions.path.replace('/rest/sound/btn_se', '/profile/content/setting')
        }
      }
    }

    // 静态文件
    let toLocal = false
    if (staticHostNames.includes(hostname)) {
      const newPathname = pathname
      if (CONFIG.staticServer && staticMap.has(newPathname)) {
        toLocal = true
        newRequestOptions.hostname = '127.0.0.1'
        newRequestOptions.port = CONFIG.staticPort
        newRequestOptions.path = newRequestOptions.path.replace(pathname , `/${staticMap.get(newPathname)}`)
      }
    }

    if (CONFIG.frontAgent && !toLocal) {
      newRequestOptions.hostname = CONFIG.frontAgentHost
      newRequestOptions.port = CONFIG.frontAgentPort
      newRequestOptions.path = uri.origin() + newRequestOptions.path

    }

    return requestDetail
  },
  async beforeSendResponse(requestDetail, responseDetail) {
    const uri = URI(requestDetail.url)
    let result = responseDetail
    // result = searchSomething(responseDetail, uri)
    if (apiHostNames.includes(uri.hostname())) {
      // 处理剧情 response
      const pathname = uri.path()
      const uid = uri.search(true).uid
      if (CONFIG.transScenario && pathname.includes('scenario')) {
        result = await scenarioProcess(result, uid, pathname)
      }
      if (pathname.includes('/content/')) {
        // result = await phraseProcess(result)
        // if (pathname.includes('/newindex/')) {
        //   result = await newquestProcess(result)
        // }
        if (pathname === '/profile/content/setting') {
          getUserName(result, uid)
        }
      }
      if (pathname === '/rest/sound/btn_se') {
        result = getUserName(result, uid, 'btn_se')
      }
      if (pathname === '/') {
        getUserInfo(result.response.body.toString())
        if (CONFIG.transUi) {
          result = transUI(result, CONFIG)
        }
      }
    }

    return result
  },
  *beforeDealHttpsRequest (requestDetail) {
    return CONFIG.proxyHttps
  }
}
