const { readCsv, sortKeywords, writeCsv, sortByStr } = require('../utils/')
const { USER_DATA_PATH, dataPath } = require('../store/')
const path = require('path')
const chokidar = require('chokidar')
const { debounce } = require('lodash')

const enNameMap = new Map()
const jpNameMap = new Map()
const nounMap = new Map()
const langMsgMap = new Map()

const nameData = {
  enNameMap, jpNameMap, nounMap, langMsgMap
}

const cwd = process.cwd()

const mergeList = async (pathLocal, pathStable, key = 'name') => {
  const list = []
  const tempMap = new Map()
  let listLocal = await readCsv(pathLocal, true)
  let listStable = await readCsv(pathStable)
  listStable.concat(listLocal).forEach(item => {
    if (item[key] && !tempMap.get(item[key])) {
      list.push(item)
      tempMap.set(item[key], item.trans)
    }
  })
  return { list, listLocal }
}

const getData = async (lang) => {
  const DATA_PATH = await dataPath()
  const NAME_EN_PATH = path.resolve(DATA_PATH, 'npc-name-en.csv')
  const NAME_JP_PATH = path.resolve(DATA_PATH, 'npc-name-jp.csv')
  const NAME_EN_PATH_LOCAL = path.resolve(USER_DATA_PATH, 'local', 'npc-name-en.csv')
  const NAME_JP_PATH_LOCAL = path.resolve(USER_DATA_PATH, 'local', 'npc-name-jp.csv')

  const pathLocal = lang === 'en' ? NAME_EN_PATH_LOCAL : NAME_JP_PATH_LOCAL
  const pathStable = lang === 'en' ? NAME_EN_PATH : NAME_JP_PATH
  const { list } = await mergeList(pathLocal, pathStable)
  const result = new Map()
  sortKeywords(list).forEach(item => {
    result.set(item.name, item.trans)
  })
  if (lang === 'en') {
    nameData['enNameMap'] = result
  } else {
    nameData['jpNameMap'] = result
  }
}

getData('en')
getData('jp')

const readNoun = async () => {
  const DATA_PATH = await dataPath()
  const NOUN_PATH = path.resolve(DATA_PATH, 'noun.csv')
  const NOUN_PATH_LOCAL = path.resolve(USER_DATA_PATH, 'local', 'noun.csv')
  let { list, listLocal } = await mergeList(NOUN_PATH_LOCAL, NOUN_PATH, 'keyword')
  sortKeywords(list, 'keyword').forEach(item => {
    if (item.keyword && item.keyword.trim()) {
      nounMap.set(item.keyword, {
        trans: item.trans,
        ignoreCase: !item.cs
      })
    }
  })
  if (!listLocal.length) {
    writeCsv(NOUN_PATH_LOCAL, list)
  }
}

readNoun()

const readMsg = async () => {
  const DATA_PATH = await dataPath()
  const LANG_MSG_PATH = path.resolve(DATA_PATH, 'lang-msg.csv')
  const LANG_MSG_PATH_LOCAL = path.resolve(USER_DATA_PATH, 'local', 'lang-msg.csv')
  let { list, listLocal } = await mergeList(LANG_MSG_PATH_LOCAL, LANG_MSG_PATH, 'id')
  sortKeywords(list, 'id').forEach(item => {
    if (item.id && item.id.trim()) {
      langMsgMap.set(item.id, {
        trans: item.trans,
        en: item.en,
        jp: item.jp
      })
    }
  })
  if (!listLocal.length) {
    // writeCsv(LANG_MSG_PATH_LOCAL, sortByStr(list, 'id').filter(item => !!item.id))
  }
}

readMsg()

const nameFileChange = debounce((file) => {
  const lang = file.match(/-(en|jp)\.csv$/)[1]
  getData(lang)
}, 1000)

const nounFileChange = debounce((file) => {
  readNoun()
}, 1000)

const msgFileChange = debounce((file) => {
  readMsg()
}, 1000)

setTimeout(() => {
  chokidar.watch(['local/npc-name-*.csv'], {
    cwd: USER_DATA_PATH
  }).on('change', nameFileChange)

  chokidar.watch(['local/noun.csv'], {
    cwd: USER_DATA_PATH
  }).on('change', nounFileChange)

  chokidar.watch(['local/lang-msg.csv'], {
    cwd: USER_DATA_PATH
  }).on('change', msgFileChange)
}, 3000)

module.exports = {
  getData,
  readNoun,
  readMsg,
  nameData
}
