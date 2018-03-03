const axios = require('axios')
const crypto = require('crypto')
const CONFIG = require('../utils/')

const appConfig = CONFIG.youdao || {}
const { appSecret, appKey } = appConfig

const to = 'zh-CHS'
let from = 'en'

module.exports = async (query, lang = 'en') => {
  from = lang
  if (from === 'jp') from = 'ja'
  if (!query) return ''
  const salt = Date.now()
  const str = appKey + query + salt + appSecret
  const md5 = crypto.createHash('md5')
  const sign = md5.update(str).digest('hex')
  const res = await axios.get('http://openapi.youdao.com/api', {
    params: {
      q: query,
      appKey, salt, from, to, sign
    }
  })

  if (res.data.errorCode === '0') {
    return res.data.translation.join('').replace(/<\s/g, '<').replace(/>\s/g, '>')
  } else {
    throw new Error(`调用有道翻译api失败：错误代码${res.data.errorCode}`)
  }
}