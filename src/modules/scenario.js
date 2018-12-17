import getNameData, { getNounData } from '../store/name-npc'
import parseCsv from '../utils/parseCsv'
import fetchData from '../fetch'
import config from '../config'
import insertToolHtml from '../story/insertToolHtml'
import autoDownloadCsv from '../setting/autoDownloadCsv'
import cloneDeep  from 'lodash/cloneDeep'
import { getPreviewCsv, replaceWords, removeHtmlTag } from '../utils/'
import filter from '../utils/XSSFilter'
import transApi from '../utils/translation'

const txtKeys = ['chapter_name', 'synopsis', 'detail', 'sel1_txt', 'sel2_txt', 'sel3_txt', 'sel4_txt', 'sel5_txt', 'sel6_txt']
const WORDS_LIMIT = 4500

const scenarioCache = {
  data: null,
  name: '',
  originName: '',
  hasTrans: false,
  csv: '',
  nameMap: null,
  transMap: null
}

const getFilename = (pathname) => {
  const rgs = pathname.match(/([^\/\\]+)$/)
  if (rgs && rgs[1]) {
    return rgs[1]
  }
  return pathname
}

const collectTxt = (data) => {
  const txtList = []
  const infoList = []
  const getTxt = (obj, key) => {
    const txt = obj[key]
    if (txt) {
      txtList.push(txt.replace(/\n/g, '').trim())
      infoList.push({
        id: obj.id, type: key
      })
    }
  }
  data.forEach(item => {
    txtKeys.forEach(key => getTxt(item, key))
  })
  return { txtList, infoList }
}

const transMulti = async (list, nameMap, nounMap, nounFixMap) => {
  let count = 0
  let strTemp = ''
  const txtStr = []
  const userName = config.userName
  const lang = Game.lang
  list.forEach(txt => {
    strTemp += txt
    count += new Blob([txt]).size
    if (count > WORDS_LIMIT) {
      txtStr.push(strTemp)
      count = 0
      strTemp = ''
    } else {
      strTemp += '\n'
    }
  })
  if (strTemp) {
    txtStr.push(strTemp)
  }

  const transStr = await Promise.all(txtStr.map(txt => {
    txt = removeHtmlTag(txt)
    if (config.transApi === 'google') {
      if (lang === 'en') {
        txt = replaceWords(txt, nameMap, lang)
      }
      txt = replaceWords(txt, nounMap, lang)
    } else if (config.transApi === 'caiyun') {
      txt = txt.replace(/─/g, '—').replace(/何故/g, 'なぜ').replace(/ビィ/g, '碧').replace(/Vyrn\b/g, 'Bj')
    }
    if (userName) {
      let _lang = lang
      if (!/^\w+$/.test(userName)) _lang = 'unknown'
      if (lang === 'en') {
        txt = replaceWords(txt, new Map([[userName, config.defaultEnName]]), _lang)
      } else if (config.transApi !== 'google') {
        txt = replaceWords(txt, new Map([[userName, config.defaultName]]), _lang)
      }
    }
    const targetLang = config.lang !== 'hant' ? 'zh-CN' : 'zh-TW'
    return transApi(txt, lang, targetLang)
  }))

  return transStr.reduce((result, str) => {
    let _str = str
    if (str) {
      for (let [text, fix] of nounFixMap) {
        _str = _str.replace(new RegExp(text, 'g'), fix)
      }
      if (config.displayName || userName) {
        const name = config.displayName || userName
        if (lang === 'en') {
          _str = _str.replace(new RegExp(config.defaultEnName, 'g'), name)
        } else {
          _str = _str.replace(new RegExp(config.defaultName, 'g'), name)
        }
      }
      return result.concat(_str.split('\n'))
    }
    return result
  }, [])
}

const getScenario = async (name) => {
  let csv = getPreviewCsv(name)
  if (!csv) {
    const scenarioData = await fetchData('/blhxfy/data/scenario.json')
    const pathname = scenarioData[name]
    if (!pathname) {
      return { transMap: null, csv: '' }
    }
    scenarioCache.originName = getFilename(pathname)
    csv = await fetchData(`/blhxfy/data/scenario/${pathname}`)
  }
  const list = parseCsv(csv)
  const transMap = new Map()
  list.forEach(item => {
    if (item.id) {
      const idArr = item.id.split('-')
      const id = idArr[0]
      const type = idArr[1] || 'detail'
      const obj = transMap.get(id) || {}
      obj[type] = item.trans ? filter(item.trans.replace(new RegExp(config.defaultName, 'g'), config.displayName || config.userName)) : false
      obj[`${type}-origin`] = item.trans
      transMap.set(id, obj)
    }
  })
  return { transMap, csv }
}

const getNameTrans = (name, map, scenarioName) => {
  const item = map.get(name)
  if (item) {
    let existScenario = ''
    if (item.scenarios.length) {
      for (let sName of item.scenarios) {
        if (scenarioName.indexOf(sName) !== -1) {
          existScenario = sName
          break
        }
      }
    }
    const result = { trans: item.trans, noun: item.noun }
    if (existScenario) {
      result.trans = item[existScenario].trans
      result.noun = item[existScenario].noun
    }
    return result.trans
  }
  return null
}

const collectNameHtml = (str) => {
  if (!str) return str
  let name = str
  let html = ''
  const rgs = name.match(/<[^>]+>([^<]*)<\/[^>]+>/)
  if (rgs && rgs[1]) {
    name = rgs[1]
    html = str.replace(name, '$name')
  }
  return { name, html }
}

const replaceChar = (key, item, map, scenarioName) => {
  const nameStr = item[key] ? item[key].trim() : ''
  const { name, html } = collectNameHtml(nameStr)
  if (name && name !== 'null' && name !== '???' && name !== '？？？') {
    let trans = getNameTrans(name, map, scenarioName)
    let _name = name

    if (/\s?[\?？0-9０-９]{1,2}$/.test(name)) {
      // name with number or symbol
      const nameRst = name.match(/(.+?)\s?([\?？0-9０-９]{1,2})$/)
      const _trans = getNameTrans(nameRst[1], map, scenarioName)
      _name = nameRst[1]
      if (_trans) trans = `${_trans}${nameRst[2]}`
    } else if (/'s\sVoice$/.test(name)) {
      let nmKey = name.slice(0, name.length - 8)
      const _trans = getNameTrans(nmKey, map, scenarioName)
      if (_trans) trans = `${_trans}的声音`
    } else if (/の声$/.test(name)) {
      let nmKey = name.slice(0, name.length - 2)
      const _trans = getNameTrans(nmKey, map, scenarioName)
      if (_trans) trans = `${_trans}的声音`
    }

    if (trans) {
      if (html) {
        trans = html.replace('$name', trans)
      }
      item[key] = trans
    } else if (trans !== '') {
      return _name
    }
  }
}

const transStart = async (data, pathname) => {
  const pathRst = pathname.match(/\/[^/]*?scenario.*?\/(scene[^\/]+)\/?/)
  if (!pathRst || !pathRst[1]) return data
  let sNameTemp = pathRst[1]
  if (pathRst[1].includes('birthday') || pathname.includes('season_event')) {
    let rst = pathname.match(/\/[^/]*?scenario.*?\/(scene.+)$/)
    if (!rst || !rst[1]) return data
    sNameTemp = rst[1].replace(/\//g, '_')
  }
  insertToolHtml()
  autoDownloadCsv()
  const scenarioName = sNameTemp
  scenarioCache.data = cloneDeep(data)
  scenarioCache.name = scenarioName
  scenarioCache.hasTrans = false
  scenarioCache.originName = ''
  let { transMap, csv } = await getScenario(scenarioName)
  const nameData = await getNameData()
  const nameMap = Game.lang !== 'ja' ? nameData['enNameMap'] : nameData['jpNameMap']
  scenarioCache.nameMap = nameMap
  if (!transMap) {
    if ((config.transJa && Game.lang === 'ja') || (config.transEn && Game.lang === 'en')) {
      const { nounMap, nounFixMap } = await getNounData()
      transMap = new Map()
      const { txtList, infoList } = collectTxt(data)
      const transList = await transMulti(txtList, nameMap, nounMap, nounFixMap)
      let transNotice = false
      const transApiName = {
        google: ['Google翻译', 'https://translate.google.cn'],
        caiyun: ['彩云小译', 'http://www.caiyunapp.com/fanyi/']
      }
      const apiData = transApiName[config.transApi]
      infoList.forEach((info, index) => {
        const obj = transMap.get(info.id) || {}
        obj[info.type] = transList[index] || ''
        if (!transNotice && info.type === 'detail' && obj[info.type]) {
          obj[info.type] = `(本节由<a target="_blank" style="color:#9ccd4e" href="${apiData[1]}">${apiData[0]}</a>机翻，点右上Log设置关闭)<br>${obj[info.type]}`
          transNotice = true
        }
        transMap.set(info.id, obj)
      })
    } else {
      return data
    }
  } else {
    scenarioCache.hasTrans = true
    scenarioCache.csv = csv
    scenarioCache.transMap = transMap
  }

  data.forEach((item) => {
    let name1, name2, name3
    name1 = replaceChar('charcter1_name', item, nameMap, scenarioName)
    name2 = replaceChar('charcter2_name', item, nameMap, scenarioName)
    name3 = replaceChar('charcter3_name', item, nameMap, scenarioName)

    const obj =  transMap.get(item.id)
    if (!obj) return
    txtKeys.forEach(key => {
      if (obj[key]) {
        item[key] = obj[key]
      }
    })
  })

  return data
}

export default async function (data, pathname) {
  if (Array.isArray(data)) {
    return await transStart(data, pathname)
  } else if (Array.isArray(data.scene_list)) {
    return Object.assign(data, {
      scene_list: await transStart(data.scene_list, pathname)
    })
  } else if (Array.isArray(data.scenario)) {
    return Object.assign(data, {
      scenario: await transStart(data.scenario, pathname)
    })
  } else {
    return data
  }
}

export { scenarioCache, replaceChar }
