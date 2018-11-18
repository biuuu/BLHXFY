import request from './request'
import './fix-url-search-params'
import UrlSearchParams from 'url-search-params'

const getTransResult = (data) => {
  if (data[0] && data[0].length) {
    const result = data[0].map(item => item[0]).join('')
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
  const data = new UrlSearchParams({ q: keyword })
  try {
    const res = await request(`https://translate.google.cn/translate_a/single?${query}`, {
      data: data.toString(),
      method: 'POST',
      headers: {
        'accept': '*/*',
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'referer': 'https://translate.google.cn',
        'origin':'https://translate.google.cn',
      }
    })
    const txt =  getTransResult(res)
    return txt
  } catch (err) {
    console.error(`${err.message}\n${err.stack}`)
    return ''
  }
}

export default googleTrans
