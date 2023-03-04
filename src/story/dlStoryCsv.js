import { scenarioCache, replaceChar } from '../modules/scenario'
import { tryDownload, replaceWords, removeTag, removeHtmlTag, simpleHtml, deepClone } from '../utils/'
import CONFIG from '../config'
import CSV from 'papaparse/papaparse.min'

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

const dataToCsv = (data, fill, isTrans, isAutoTrans) => {
  const result = []
  const _data = deepClone(data)
  _data.forEach(item => {
    let name = removeTag(item.charcter1_name)
    replaceChar('charcter1_name', item, scenarioCache.nameMap, scenarioCache.name)
    const transName = removeTag(item.charcter1_name)
    let hasTransName = name !== transName
    if (name && CONFIG.userName === name) {
      name = CONFIG.defaultName
      hasTransName = false
    }
    txtKeys.forEach(key => {
      let txt = item[key]
      let hasName = key === 'detail' && name && name !== 'null'
      if (txt) {
        txt = txt.replace(/\n/g, '')
        txt = simpleHtml(txt)
        let trans = ''
        if (isTrans) {
          const obj = scenarioCache.transMap.get(item.id)
          if (obj && obj[`${key}-origin`]) {
            trans = obj[`${key}-origin`]
          }
        } else if (isAutoTrans) {
          const obj = scenarioCache.transMap.get(item.id)
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
          name: hasName ? `${name}${hasTransName ? '/' + transName : ''}` : '',
          text: txt,
          trans
        })
      }
    })
  })
  let translator = ''
  if (isTrans && scenarioCache.transMap.has('translator')) {
    translator = scenarioCache.transMap.get('translator').detail
  }
  const extraInfo = {
    id: 'info',
    name: '',
    text: '',
    trans: scenarioCache.name
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

export default function (type = 'normal') {
  if (type === 'normal') {
    tryDownload(dataToCsv(scenarioCache.data), scenarioCache.name + '.csv')
  } else if (type === 'trans') {
    if (scenarioCache.hasTrans) {
      tryDownload(dataToCsv(scenarioCache.data, false, true), `${scenarioCache.originName || scenarioCache.name}.csv`)
    } else {
      if (scenarioCache.hasAutoTrans) {
        if (confirm('这个章节还没有翻译，是否下载含有机翻文本的文件。')) {
          tryDownload(dataToCsv(scenarioCache.data, false, false, true), scenarioCache.name + '.csv')
        }
      } else {
        alert('这个章节还没有翻译。')
      }
    }
  } else if (type === 'fill') {
    tryDownload(dataToCsv(scenarioCache.data, true), scenarioCache.name + '.csv')
  }
}
