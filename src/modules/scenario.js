import pako from 'pako/dist/pako_inflate.min.js'
import getNameData, { getNounData } from '../store/name-npc'
import transName from '../utils/trans-name'
import parseCsv from '../utils/parseCsv'
import fetchData from '../fetch'
import config from '../config'
import insertToolHtml from '../story/insertToolHtml'
import autoDownloadCsv from '../setting/autoDownloadCsv'
import { getPreviewCsv, replaceWords, removeHtmlTag, restoreHtml, deepClone } from '../utils/'
import filter from '../utils/XSSFilter'
import transApi from '../utils/translation'
import setFont from '../setting/scenarioFont'

const txtKeys = ['chapter_name', 'synopsis', 'detail', 'sel1_txt', 'sel2_txt', 'sel3_txt', 'sel4_txt', 'sel5_txt', 'sel6_txt']

const scenarioCache = {
  data: null,
  name: '',
  originName: '',
  hasTrans: false,
  hasAutoTrans: false,
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
  const getTxt = (obj, key, index) => {
    const txt = obj[key]
    if (txt) {
      txtList.push(txt.replace(/\n/g, '').trim())
      infoList.push({
        id: obj.id, type: key, index
      })
    }
  }
  data.forEach((item, index) => {
    txtKeys.forEach(key => getTxt(item, key, index))
  })
  return { txtList, infoList }
}

const getStartIndex = (data) => {
  const findStart = (item, index) => {
    if (!item) return false
    if (item.detail) {
      return index
    } else if (item.next) {
      const next = (item.next | 0) || -1
      return findStart(data[next], next)
    } else {
      return findStart(data[index + 1], index + 1)
    }
  }
  return findStart(data[0], 0)
}

const transMulti = async (list, nameMap, nounMap, nounFixMap, caiyunPrefixMap) => {

  const userName = config.userName
  const lang = Game.lang
  const _list = list.map(txt => {
    if (config.transApi === 'google') {
      if (lang === 'en') {
        txt = replaceWords(txt, nameMap, lang)
      }
      txt = replaceWords(txt, nounMap, lang)
    } else if (config.transApi === 'caiyun') {
      txt = replaceWords(txt, caiyunPrefixMap, lang)
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
    return txt
  })
  const transList = await transApi(_list, lang)
  if (transList[0] === 'caiyunoutoflimit') return transList
  const fixedList = transList.map(txt => {
    let _str = txt
    if (_str) {
      _str = _str.replace(/\n/g, '<br>')
      _str = replaceWords(_str, nounFixMap, lang)
      if (config.displayName || userName) {
        const name = config.displayName || userName
        if (lang === 'en') {
          _str = _str.replace(new RegExp(`${config.defaultEnName}`, 'g'), name)
        }
        _str = _str.replace(new RegExp(`${config.defaultName}(先生|小姐)?`, 'g'), name)
      }
    }
    return _str
  })
  return fixedList
}

let scenarioData
const getScenario = async (name) => {
  let csv = getPreviewCsv(name)
  if (!csv) {
    if (!scenarioData) {
      const binaryString = await fetchData('/blhxfy/data/story-map.json')
      scenarioData = JSON.parse(pako.inflate(binaryString, { to: 'string' }))
    }
    const pathname = scenarioData[name]
    if (!pathname) {
      return { transMap: null, csv: '' }
    }
    csv = await fetchData(`/blhxfy/data/story/${pathname}`)
  }
  const list = parseCsv(csv)
  const transMap = new Map()
  list.forEach(item => {
    if (item.id) {
      const idArr = item.id.split('-')
      const id = idArr[0]
      const type = idArr[1] || 'detail'
      const obj = transMap.get(id) || {}
      if (item.trans) {
        const rep = new RegExp(config.defaultName, 'g')
        const uname = config.displayName || config.userName
        const str = filter(item.trans.replace(rep, uname))
        obj[type] = str.replace(/<span\sclass="nickname"><\/span>/g, `<span class='nickname'></span>`)
      }
      obj[`${type}-origin`] = item.trans
      transMap.set(id, obj)
    }
  })
  return { transMap, csv }
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

const replaceChar = (key, item, map) => {
  const nameStr = item[key] ? item[key].trim() : ''
  const { name, html } = collectNameHtml(nameStr)
  let trans
  if (name && name === config.userName && config.displayName) {
    trans = config.displayName
  } else {
    trans = transName(name, [map])
  }
  if (trans !== name) {
    if (html) {
      trans = html.replace('$name', trans)
    }
    item[key] = trans
  }
}

const getUsernameFromTutorial = (data) => {
  for (let item of data) {
    let id = parseInt(item.id)
    if (id === 25 || id === 24) {
      if (item.charcter1_name) {
        config.userName = item.charcter1_name
        localStorage.setItem('blhxfy:name', config.userName)
      }
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
  if (pathname.includes('scene_tutorial02')) {
    getUsernameFromTutorial(data)
  }
  insertToolHtml()
  autoDownloadCsv()
  const startIndex = getStartIndex(data)
  const scenarioName = sNameTemp
  scenarioCache.data = deepClone(data)
  scenarioCache.name = scenarioName
  scenarioCache.hasTrans = false
  scenarioCache.hasAutoTrans = false
  scenarioCache.transMap = null
  let { transMap, csv } = await getScenario(scenarioName)
  if (transMap && transMap.has('filename')) {
    scenarioCache.originName = transMap.get('filename').detail
  }
  const nameData = await getNameData()
  const nameMap = Game.lang !== 'ja' ? nameData['enNameMap'] : nameData['jpNameMap']
  scenarioCache.nameMap = nameMap
  if (!transMap) {
    if ((config.transJa && Game.lang === 'ja') || (config.transEn && Game.lang === 'en')) {
      const { nounMap, nounFixMap, caiyunPrefixMap } = await getNounData()
      transMap = new Map()
      const { txtList, infoList } = collectTxt(data)
      const transList = await transMulti(txtList, nameMap, nounMap, nounFixMap, caiyunPrefixMap)
      let transNotice = false
      const transApiName = {
        google: ['Google翻译', 'https://translate.google.cn'],
        baidu: ['百度翻译', 'https://fanyi.baidu.com/'],
        caiyun: ['彩云小译', 'https://fanyi.caiyunapp.com/']
      }
      const apiData = transApiName[config.transApi]
      infoList.forEach((info, index) => {
        const obj = transMap.get(info.id) || {}
        obj[info.type] = transList[index] || ''
        if (!transNotice && info.index === startIndex && info.type === 'detail' && transList.length > 0) {
          if (transList[0] === 'caiyunoutoflimit') {
            // obj[info.type] = ``
          } else {
            obj[info.type] = `<a href="${apiData[1]}" target="_blank" class="autotrans-hint-blhxfy ${config.transApi}-blhxfy"> </a>${obj[info.type]}`
          }
          transNotice = true
        }
        transMap.set(info.id, obj)
      })
      if (transList.length > 0) {
        scenarioCache.hasAutoTrans = true
        scenarioCache.transMap = transMap
      }
    } else {
      return data
    }
  } else {
    scenarioCache.hasTrans = true
    scenarioCache.csv = csv
    scenarioCache.transMap = transMap
  }

  if (scenarioCache.hasAutoTrans || scenarioCache.hasTrans) {
    setFont()
  }

  data.forEach((item, index) => {
    replaceChar('charcter1_name', item, nameMap)
    replaceChar('charcter2_name', item, nameMap)
    replaceChar('charcter3_name', item, nameMap)

    const obj =  transMap.get(item.id)
    if (!obj) return
    txtKeys.forEach(key => {
      if (obj[key]) {
        if (key === 'detail' && config.originText) {
          item[key] = `${restoreHtml(obj[key], item[key])}
          <div class="blhxfy-origin-text" data-text='${removeHtmlTag(item[key], 0, true)}'> </div>`
        } else {
          item[key] = restoreHtml(obj[key], item[key])
        }
        if (scenarioCache.hasTrans && config.showTranslator && key === 'detail' && index === startIndex) {
          let name = '我们仍未知道翻译这篇剧情的骑空士的名字'
          if (transMap.has('translator')) {
            name = transMap.get('translator').detail || name
          }
          item[key] = `<a class="autotrans-hint-blhxfy translator-blhxfy" data-text="译者：${name}"> </a>${item[key]}`
        }
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
