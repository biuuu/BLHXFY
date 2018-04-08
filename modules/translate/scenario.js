const path = require('path')
const googleTrans = require('../../api/google')
const youdaoTrans = require('../../api/youdao')
const baiduTrans = require('../../api/baidu')
const users = require('../../store/users')
const scenarioState = require('../../store/scenarioState')
const CONFIG = require('../../config')
const { nameData } = require('../../store/nameMap')
const { removeHtmlTag, replaceWords, readCsv, writeCsv } = require('../../utils/')
const saveNames = require('../../utils/saveNames')
const saveScenario = require('../../utils/saveScenario')
const readScenario = require('../../utils/readScenario')

let transApi = googleTrans
if (CONFIG.transService === 'youdao') transApi = youdaoTrans
if (CONFIG.transService === 'baidu') transApi = baiduTrans

const WORDS_LIMIT = 4500
const txtKeys = ['chapter_name', 'synopsis', 'detail', 'sel1_txt', 'sel2_txt', 'sel3_txt', 'sel4_txt']

const replaceChar = (key, item, map) => {
  const name = item[key]
  if (name && name !== 'null' && name !== '???' && name !== '？？？') {
    let trans = map.get(name)
    let _name = name

    if (/\s?[\?？0-9０－９]{1,2}$/.test(name)) {
      // name with number or symbol
      const nameRst = name.match(/(.+)\s?([\?？0-9０－９]{1,2})$/)
      trans = map.get(nameRst[1])
      _name = nameRst[1]
      if (trans) trans += nameRst[2]
    } else if (/'s\sVoice$/.test(name)) {
      let nmKey = name.slice(0, name.length - 7)
      trans = map.get(nmKey)
      if (trans) trans += '的声音'
    } else if (/の声$/.test(name)) {
      let nmKey = name.slice(0, name.length - 2)
      trans = map.get(nmKey)
      if (trans) trans += '的声音'
    } 

    if (trans) {
      item[key] = trans
    } else if (trans !== '') {
      return _name
    }
  }
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


const transMulti = async (list, lang, userName) => {
  let count = 0
  let strTemp = ''
  const txtStr = []
  list.forEach(txt => {
    strTemp += txt
    count += Buffer.byteLength(txt, 'utf8')
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
  
  const nameMap = lang !== 'jp' ? nameData['enNameMap'] : nameData['jpNameMap']
  const transStr = await Promise.all(txtStr.map(txt => {
    txt = removeHtmlTag(txt)
    txt = replaceWords(txt, nameMap, lang)
    txt = replaceWords(txt, nameData['nounMap'], lang)
    if (CONFIG.yourName && userName) {
      let _lang = lang
      if (!/^\w+$/.test(userName)) _lang = 'unknown'
      txt = replaceWords(txt, new Map([[userName, CONFIG.yourName]]), _lang)
    }
    return transApi(txt, lang)
  }))
  return transStr.reduce((result, str) => {
    let _str = str
    if (str) {
      if (CONFIG.yourName) {
        const expr = CONFIG.yourName.replace(/\?/g, '\\?').replace(/\./g, '\\.').replace(/\*/g, '\\*').replace(/\+/g, '\\+')
        _str = _str.replace(new RegExp(expr, 'g'), userName)
      }
      return result.concat(_str.split('\n'))
    }
    return result
  }, [])
}

const cloneScenario = (data) => {
  const list = []
  data.forEach(item => {
    list.push(Object.assign({}, item))
  })
  return list
}

module.exports = async (data, uid, pathname) => {
  const pathRst = pathname.match(/\/scenario.*?\/(scene[^\/]+)\/?/)
  if (!pathRst || !pathRst[1]) return data
  const scenarioName = pathRst[1]
  const currentUser = users.get(uid)
  const lang = currentUser ? currentUser.lang : 'en'
  const userName = currentUser ? currentUser.name : CONFIG.yourName
  const nameMap = lang !== 'jp' ? nameData['enNameMap'] : nameData['jpNameMap']
  const { txtList, infoList } = collectTxt(data)
  let transMap = new Map()

  const scenarioInfo = scenarioState.map.get(scenarioName)
  if (
    scenarioState.status === 'loaded' 
    && scenarioInfo
    && (scenarioInfo.stable || scenarioInfo.trans)
  ) {
    transMap = await readScenario(scenarioInfo, userName)
    if (!scenarioInfo.stable) {
      saveScenario(transMap, cloneScenario(data), scenarioName, userName, lang)
      .catch(err => console.error(`保存剧情CSV失败：${err}\n${err.stack}`))
    }
  } else {
    const transList = CONFIG.transService 
      ? await transMulti(txtList, lang, userName)
      : []
    infoList.forEach((info, index) => {
      const obj = transMap.get(info.id) || {}
      obj[info.type] = transList[index] || ''
      transMap.set(info.id, obj)
    })
    if (scenarioState.status === 'loaded') {
      saveScenario(transMap, cloneScenario(data), scenarioName, userName, lang, !transList.length)
      .catch(err => console.error(`保存剧情CSV失败：${err}\n${err.stack}`))
    }
  }
  
  let names = []
  data.forEach((item, index) => {
    let name1, name2, name3
    name1 = replaceChar('charcter1_name', item, nameMap)
    name2 = replaceChar('charcter2_name', item, nameMap)
    name3 = replaceChar('charcter3_name', item, nameMap)
    name1 && !names.includes(name1) && names.push(name1)
    name2 && !names.includes(name2) && names.push(name2)
    name3 && !names.includes(name3) && names.push(name3)
    const obj =  transMap.get(item.id)
    if (!obj) return
    txtKeys.forEach(key => {
      if (obj[key]) {
        item[key] = obj[key]
      }
    })
  })
  names.length && saveNames(names, lang)
  return data
}

// setTimeout(() => {
//   transMulti(['wha of primal beasts... '], 'en', 'aaa').then(data => {
//     console.log(data)
//   })
// },3000)
