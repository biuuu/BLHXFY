import { replaceWords, removeTag, removeHtmlTag, simpleHtml, deepClone } from './index'
import CSV from 'papaparse/papaparse.min'
import CONFIG from '../config'

const txtKeys = ['chapter_name', 'synopsis', 'detail', 'sel1_txt', 'sel2_txt', 'sel3_txt', 'sel4_txt', 'sel5_txt', 'sel6_txt']

const replaceName = (content, userName) => {
  if (userName) {
    content.forEach(item => {
      if (item.id === 'info') return
      ;['name', 'text', 'trans'].forEach(key => {
        if (!item[key]) return
        let _lang = Game.lang
        if (!/^\w+$/.test(userName)) _lang = 'unknown'
        item[key] = replaceWords(item[key], new Map([[userName, '姬塔']]), _lang)
      })
    })
  }
}

const dataToCsv = (data, { nameMap, name, transMap, hasTrans, hasAutoTrans } = {}, fill, isTrans, isAutoTrans) => {
  const result = []
  const _data = deepClone(data)
  
  // 提取原本 scenario.js 中的 replaceChar 核心逻辑以避免依赖
  const getTransName = (nameStr, map) => {
    if (!nameStr) return ''
    let _name = nameStr.trim()
    const rgs = _name.match(/<[^>]+>([^<]*)<\/[^>]+>/)
    if (rgs && rgs[1]) {
      _name = rgs[1]
    }
    return map.has(_name) ? map.get(_name) : _name
  }

  _data.forEach(item => {
    let rawName = removeTag(item.charcter1_name || '')
    const transName = getTransName(item.charcter1_name || '', nameMap)
    let hasTransName = rawName !== transName
    if (rawName && CONFIG.userName === rawName) {
      rawName = CONFIG.defaultName
      hasTransName = false
    }
    
    txtKeys.forEach(key => {
      let txt = item[key]
      let hasName = key === 'detail' && rawName && rawName !== 'null'
      if (txt) {
        txt = txt.replace(/\n/g, '')
        txt = simpleHtml(txt)
        let trans = ''
        if (isTrans && transMap) {
          const obj = transMap.get(item.id)
          if (obj && obj[`${key}-origin`]) {
            trans = obj[`${key}-origin`]
          }
        } else if (isAutoTrans && transMap) {
          const obj = transMap.get(item.id)
          if (obj && obj[key]) {
            trans = obj[key]
          }
        } else if (fill) {
          trans = txt
        }

        if (CONFIG.plainText) {
          txt = removeHtmlTag(txt)
          trans = removeHtmlTag(trans)
        }

        result.push({
          id: `${item.id}${key === 'detail' ? '' : '-' + key}`,
          name: hasName ? (isAutoTrans ? rawName : `${rawName}${hasTransName ? '/' + transName : ''}`) : '',
          text: txt,
          trans
        })
      }
    })
  })
  
  let translator = ''
  if (isTrans && transMap && transMap.has('translator')) {
    translator = transMap.get('translator').detail
  }
  const extraInfo = {
    id: 'info',
    name: '',
    text: '',
    trans: name
  }
  replaceName(result, CONFIG.userName)
  result.push(extraInfo)
  result.push({
    id: '译者',
    name: '',
    text: '',
    trans: translator
  })
  return CSV.unparse(result)
}

const dataToJson = (data) => {
  const result = []
  data.forEach(item => {
    const rawName = removeTag(item.charcter1_name || '')
    txtKeys.forEach(key => {
      let txt = item[key]
      if (txt) {
        txt = txt.replace(/\n/g, '')
        txt = simpleHtml(txt)
        if (CONFIG.plainText) {
          txt = removeHtmlTag(txt)
        }
        result.push({
          id: `${item.id}${key === 'detail' ? '' : '-' + key}`,
          name: rawName !== 'null' ? rawName : '',
          text: txt
        })
      }
    })
  })
  return JSON.stringify(result)
}

export { dataToCsv, dataToJson }
