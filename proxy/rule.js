const parseScenario = require('../modules/translate/scenario')
const parsePhrase = require('../modules/translate/phrase')
const parseNewquest = require('../modules/translate/new-quest')
const { getUserInfo, getUserName } = require('../modules/info/user')
const CONFIG = require('../config.js')
const URI = require('urijs')
const { processResponseBody } = require('../utils/')
const users = require('../store/users')

const apiHostNames = CONFIG.apiHostNames

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
    }
    if (CONFIG.frontAgent) {
      newRequestOptions.hostname = CONFIG.frontAgentHost
      newRequestOptions.port = CONFIG.frontAgentPort
      newRequestOptions.path = requestDetail.url
    }
    const uri = URI(requestDetail.url)
    const pathname = uri.pathname()
    const query = uri.search(true)
    if (CONFIG.interceptTwitterWidgets && requestDetail.url === 'http://platform.twitter.com/widgets.js') {
      return { response: { statusCode: 200, header: {}, body: '' } }
    }
    
    if (pathname === '/rest/sound/btn_se') {
      const user = users.get(query.uid)
      if (user && !user.name) {
        newRequestOptions.path = newRequestOptions.path.replace('/rest/sound/btn_se', '/profile/content/setting')
      }
    }
    return requestDetail
  },
  async beforeSendResponse(requestDetail, responseDetail) {
    const uri = URI(requestDetail.url)
    let result = null
    result = searchSomething(responseDetail, uri)
    if (apiHostNames.includes(uri.hostname())) {
      // 处理剧情 response
      const pathname = uri.path()
      const uid = uri.search(true).uid
      if (CONFIG.transScenario && pathname.includes('scenario')) {
        result = await scenarioProcess(result, uid, pathname)
      }
      if (CONFIG.transPhrase && pathname.includes('/content/')) {
        result = await phraseProcess(result)
        if (pathname.includes('/newindex/')) {
          result = await newquestProcess(result)
        }
        if (pathname === '/profile/content/setting') {
          getUserName(result, uid)
        }
      }
      if (pathname === '/rest/sound/btn_se') {
        result = getUserName(result, uid, 'btn_se')
      }
      if (pathname === '/') {
        getUserInfo(result.response.body.toString())
      }
    }
    
    return result
  },
  *beforeDealHttpsRequest (requestDetail) {
    return CONFIG.proxyHttps
  }
}