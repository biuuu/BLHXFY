const scenarioState = require('../store/scenarioState')
const path = require('path')
const { readCsv, writeCsv, replaceWords } = require('./index')
const CONFIG = require('../config')
const { USER_DATA_PATH } = require('../store/')

const txtKeys = ['chapter_name', 'synopsis', 'detail', 'sel1_txt', 'sel2_txt', 'sel3_txt', 'sel4_txt']

const replaceName = (content, userName) => {
  if (CONFIG.yourName && userName) {
    content.forEach(item => {
      if (item.id === 'info') return
      ;['en', 'jp', 'trans'].forEach(key => {
        if (!item[key]) return
        let _lang = key
        if (!/^\w+$/.test(userName)) _lang = 'unknown'
        item[key] = replaceWords(item[key], new Map([[userName, CONFIG.yourName]]), _lang)
      })
    })
  }
}

const saveScenario = async (map, data, scenarioName, userName, lang, empty) => {
  const info = scenarioState.map.get(scenarioName)
  const scenarioPath = path.resolve(USER_DATA_PATH, 'local/scenario/', `${scenarioName}.csv`)
  const result = []
  if (!info) {
    data.forEach(item => {
      txtKeys.forEach(key => {
        let txt = item[key]
        if (txt) { 
          txt = txt.replace(/\n/g, '')
          result.push({
            id: `${item.id}${key === 'detail' ? '' : '-' + key}`,
            en: lang === 'en' ? txt : '',
            jp: lang === 'jp' ? txt : '',
            trans: map.has(item.id) ? map.get(item.id)[key] : ''
          })
        }
      })
    })
    const extraInfo = { 
      id: 'info', 
      en: lang === 'en' ? '1' : '', 
      jp: lang === 'jp' ? '1' : '',
      trans: empty ? '' : scenarioName
    }
    replaceName(result, userName)
    result.push(extraInfo)
    await writeCsv(scenarioPath, result)
    scenarioState.map.set(scenarioName, {
      en: extraInfo.en,
      jp: extraInfo.jp,
      trans: extraInfo.trans,
      filename: scenarioName + '.csv'
    })
  } else {
    if (info.en && info.jp) return
    if (info.en && lang === 'en') return
    if (info.jp && lang === 'jp') return
    const existPath = path.resolve(USER_DATA_PATH, 'local/scenario/', `${info.filename}`)
    const list = await readCsv(existPath)
    const localMap = new Map()
    list.filter(row => row.id).forEach(row => {
      localMap.set(row.id, {
        en: row.en,
        jp: row.jp,
        trans: row.trans
      })
    })
    data.forEach(item => {
      txtKeys.forEach(key => {
        let txt = item[key]
        if (txt) {
          txt = txt.replace(/\n/g, '')
          const mKey = `${item.id}${key === 'detail' ? '' : '-' + key}`
          const obj = localMap.get(mKey)
          if (obj) {
            obj[lang] = txt
            if (!obj.trans) obj.trans = map.has(item.id) ? map.get(item.id)[key] : ''
          } else {
            localMap.set(mKey, {
              en: lang === 'en' ? txt : '',
              jp: lang === 'jp' ? txt : '',
              trans: map.has(item.id) ? map.get(item.id)[key] : ''
            })
          }
        }
      })
    })
    localMap.get('info')[lang] = '1'
    for (let obj of localMap) {
      result.push({
        id: obj[0],
        en: obj[1].en,
        jp: obj[1].jp,
        trans: obj[1].trans
      })
    }
    replaceName(result, userName)
    await writeCsv(existPath, result)
    info[lang] = '1'
  }
}

module.exports = saveScenario