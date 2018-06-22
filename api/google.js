const axios = require('axios')
const UrlSearchParams = require('url-search-params')

const getTransResult = (res) => {
  if (res.data[0] && res.data[0].length) {
    const result = res.data[0].map(item => item[0]).join('')
    return result
  }
  return ''
}


const googleTrans = async (keyword, lang = 'en', to = 'zh-CN') => {
  let query = new UrlSearchParams({
    client: 'gtx',
    sl: lang,
    tl: to,
    hl: 'zh-CN',
    ie:'UTF-8',
    oe:'UTF-8'
  })
  query = query.toString()
  ;['at', 'bd', 'ex', 'ld', 'md', 'qca', 'rw', 'rm', 'ss', 't'].forEach(item => {
    query += `&dt=${item}`
  })
  const data = { q: keyword }
  try {
    const res = await axios.request({
      url: `https://translate.google.cn/translate_a/single?${query}`,
      params: data,
      method: 'post',
      headers: {
        'referer': 'https://translate.google.cn',
        'origin':'https://translate.google.cn',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36,',
      }
    })
    const txt =  getTransResult(res)
    return txt.replace(/空空团/g, '骑空团').replace(/星星兽/g, '星晶兽')
  } catch (err) {
    console.error(`${err.message}\n${err.stack}`)
    return ''
  }
}

module.exports = googleTrans
