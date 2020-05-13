import pako from 'pako/dist/pako_inflate.min.js'
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
    scenarioCache.originName = getFilename(pathname)
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
      obj[type] = item.trans ? filter(item.trans.replace(new RegExp(config.defaultName, 'g'), config.displayName || config.userName)) : false
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
    } else if (!trans && /・/.test(name)) {
      const arr = _name.split('・')
      trans = arr.map(nm => {
        const rst = getNameTrans(nm, map, scenarioName)
        return rst || nm
      }).join('・')
    } else if (!trans && /\band\b/i.test(name)) {
      const arr = _name.split(' and ')
      trans = arr.map(nm => {
        const rst = getNameTrans(nm, map, scenarioName)
        return rst || nm
      }).join('・')
    }

    if (trans) {
      if (html) {
        trans = html.replace('$name', trans)
      }
      item[key] = trans
    } else if (trans !== '') {
      return name
    }
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
  const scenarioName = sNameTemp
  scenarioCache.data = cloneDeep(data)
  scenarioCache.name = scenarioName
  scenarioCache.hasTrans = false
  scenarioCache.hasAutoTrans = false
  scenarioCache.transMap = null
  scenarioCache.originName = ''
  let { transMap, csv } = await getScenario(scenarioName)
  const nameData = await getNameData()
  const nameMap = Game.lang !== 'ja' ? nameData['enNameMap'] : nameData['jpNameMap']
  scenarioCache.nameMap = nameMap
  if (!transMap) {
    if ((config.transJa && Game.lang === 'ja') || (config.transEn && Game.lang === 'en')) {
      const { nounMap, nounFixMap, caiyunPrefixMap } = await getNounData()
      transMap = new Map()
      const { txtList, infoList } = collectTxt(data)
      const startIndex = getStartIndex(data)
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
            obj[info.type] = `<span style="color:#fd8484;font-size:10px;">彩云小译超出使用次数，请尝试登录彩云账号后再使用。可以通过点击右上角Log按钮，然后点击链接打开登录页面：</span><a style="color:#62dccb;font-size:10px;" href="http://www.caiyunapp.com/user/login/" target="_blank">彩云用户登录</a>`
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

  data.forEach((item) => {
    let name1, name2, name3
    name1 = replaceChar('charcter1_name', item, nameMap, scenarioName)
    name2 = replaceChar('charcter2_name', item, nameMap, scenarioName)
    name3 = replaceChar('charcter3_name', item, nameMap, scenarioName)

    const obj =  transMap.get(item.id)
    if (!obj) return
    txtKeys.forEach(key => {
      if (obj[key]) {
        if (key === 'detail' && config.originText) {
          item[key] = `${obj[key]}
          <div class="blhxfy-origin-text" data-text='${removeHtmlTag(item[key], 0, true)}'> </div>`
        } else {
          item[key] = obj[key]
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
