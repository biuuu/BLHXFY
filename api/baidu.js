const axios = require('axios')
const crypto = require('crypto')
const CONFIG = require('../utils/')

const appConfig = CONFIG.baidu || {}
const { appSecret, appid } = appConfig

const to = 'zh'
let from = 'en'

const translate = async (query, lang = 'en') => {
  from = lang
  if (!query.trim() || !appid) return ''
  const salt = Date.now()
  const str = appid + query + salt + appSecret
  const md5 = crypto.createHash('md5')
  const sign = md5.update(str).digest('hex')
  const res = await axios.get('https://fanyi-api.baidu.com/api/trans/vip/translate', {
    params: {
      q: query,
      salt, from, to, sign, appid
    }
  })
  return res.data.trans_result[0].dst
}

module.exports = async (query) => {
  const list = query.split('\n')
  const results = await Promise.all(list.map(words => {
    return translate(words)
  }))
  return results.join('\n')
}