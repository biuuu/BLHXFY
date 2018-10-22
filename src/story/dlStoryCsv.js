import { scenarioCache } from '../modules/scenario'
import { tryDownload, replaceWords } from '../utils/'
import CONFIG from '../config'
import CSV from 'papaparse'

const txtKeys = ['chapter_name', 'synopsis', 'detail', 'sel1_txt', 'sel2_txt', 'sel3_txt', 'sel4_txt']

const replaceName = (content, userName) => {
  if (userName) {
    content.forEach(item => {
      if (item.id === 'info') return
      ;['en', 'jp'].forEach(key => {
        if (!item[key]) return
        let _lang = key
        if (!/^\w+$/.test(userName)) _lang = 'unknown'
        item[key] = replaceWords(item[key], new Map([[userName, '姬塔']]), _lang)
      })
    })
  }
}

const dataToCsv = (data, fill) => {
  const result = []
  data.forEach(item => {
    txtKeys.forEach(key => {
      let txt = item[key]
      if (txt) {
        txt = txt.replace(/\n/g, '')
        result.push({
          id: `${item.id}${key === 'detail' ? '' : '-' + key}`,
          en: Game.lang === 'en' ? txt : '',
          jp: Game.lang === 'ja' ? txt : '',
          trans: fill ? txt : ''
        })
      }
    })
  })
  const extraInfo = {
    id: 'info',
    en: Game.lang === 'en' ? '1' : '',
    jp: Game.lang === 'ja' ? '1' : '',
    trans: scenarioCache.name
  }
  replaceName(result, CONFIG.userName)
  result.push(extraInfo)
  return CSV.unparse(result)
}

export default function (type = 'normal') {
  if (type === 'normal') {
    tryDownload(dataToCsv(scenarioCache.data), scenarioCache.name + '.csv')
  } else if (type === 'trans') {
    if (scenarioCache.hasTrans) {
      tryDownload(scenarioCache.csv, scenarioCache.name + '.csv')
    } else {
      alert('这个章节还没有翻译。')
    }
  } else if (type === 'fill') {
    tryDownload(dataToCsv(scenarioCache.data, true), scenarioCache.name + '.csv')
  }
}
