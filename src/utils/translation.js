import request from './request'
import './fix-url-search-params'
import UrlSearchParams from 'url-search-params'
import config from '../config'
import { removeHtmlTag } from './index'
import caiyunApi from './caiyun'

const joinBr = (list, br, transArr) => {
  br.forEach(count => {
    let i = count
    let str = ''
    while (i >= 0) {
      i--
      let _str = list.shift()
      str += _str + '\n'
    }
    if (str) {
      transArr.push(str.slice(0, str.length - 1))
    }
  })
}

const getTransResult = (data) => {
  if (data[0] && data[0].length) {
    const result = data[0].map(item => item[0])
    return result.join('').split('\n')
  }
  return []
}

const trim = (str) => {
  if (!str) return ''
  let _str = str.replace(/[\u0020]+$/g, '')
  return _str.replace(/^[\u0020]+/g, '')
}

const fixWrap = (str) => {
  return trim(str).replace(/\r/g, '\n').replace(/\n{2,}/g, '\n')
}

const joinText = (list) => {
  let br = []
  let _list = list.map(text => removeHtmlTag(fixWrap(text)))
  _list.forEach((text) => {
    let count = [...text].filter(l => l === '\n').length
    br.push(count)
  })
  let query = _list.join('\n')
  return [query, br]
}

const splitText = (text, WORDS_LIMIT = 4000) => {
  let strTemp = ''
  let arr = []
  let count = 0
  text.split('\n').forEach(txt => {
    strTemp += txt
    count += new Blob([txt]).size
    if (count > WORDS_LIMIT) {
      arr.push(strTemp)
      count = 0
      strTemp = ''
    } else {
      strTemp += '\n'
    }
  })
  if (strTemp) {
    arr.push(strTemp.replace(/\n$/, ''))
  }
  return arr
}

const googleApi = async (keyword, from = 'ja') => {
  let query = new UrlSearchParams({
    client: 'gtx',
    sl: from,
    tl: 'zh-CN',
    hl: 'zh-CN',
    ie:'UTF-8',
    oe:'UTF-8'
  })
  query = query.toString()
  ;['at', 'bd', 'ex', 'ld', 'md', 'qca', 'rw', 'rm', 'ss', 't'].forEach(item => {
    query += `&dt=${item}`
  })
  const data = new UrlSearchParams({ q: keyword })
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
  return getTransResult(res)
}

const googleTrans = async (source, from = 'ja') => {
  try {
    let [query, br] = joinText(source)
    let textArr = splitText(query)
    let result = await Promise.all(textArr.map(query => googleApi(query, from)))
    let list = result.reduce((a, b) => a.concat(b))
    let transArr = []
    joinBr(list, br, transArr)
    return transArr
  } catch (e) {
    console.info(e)
    return []
  }
}

const caiyunTrans = async (source, from) => {
  try {
    let [query, br] = joinText(source)
    let textArr = splitText(query)
    let result = await Promise.all(textArr.map(query => {
      return caiyunApi(query.split('\n'), from)
    }))
    let list = result.reduce((a, b) => a.concat(b))
    let transArr = []
    joinBr(list, br, transArr)
    return transArr
  } catch (e) {
    console.info(e)
    return []
  }
}

export default async function (...args) {
  if (config.transApi === 'caiyun') {
    return caiyunTrans(...args)
  } else if (config.transApi === 'google') {
    return googleTrans(...args)
  }
}
