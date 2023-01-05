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
