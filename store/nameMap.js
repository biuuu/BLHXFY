const { readCsv, sortKeywords, writeCsv } = require('../utils/')
const path = require('path')
const chokidar = require('chokidar')
const { debounce } = require('lodash')

const enNameMap = new Map()
const jpNameMap = new Map()
const nounMap = new Map()

const nameData = {
  enNameMap, jpNameMap, nounMap
}

const cwd = process.cwd()
const userDataPath = path.resolve(process.env.APPDATA, process.env.npm_package_name)

const NAME_EN_PATH = path.resolve(__dirname, '../data', 'npc-name-en.csv')
const NAME_JP_PATH = path.resolve(__dirname, '../data', 'npc-name-jp.csv')
const NAME_EN_PATH_LOCAL = path.resolve(userDataPath, 'local', 'npc-name-en.csv')
const NAME_JP_PATH_LOCAL = path.resolve(userDataPath, 'local', 'npc-name-jp.csv')
const NOUN_PATH = path.resolve(__dirname, '../data', 'noun.csv')
const NOUN_PATH_LOCAL = path.resolve(userDataPath, 'local', 'noun.csv')

const mergeList = async (pathLocal, pathStable, key = 'name') => {
  const list = []
  const tempMap = new Map()
  let listLocal = await readCsv(pathLocal)
  let listStable = await readCsv(pathStable)
  listStable.concat(listLocal).forEach(item => {
    if (!tempMap.get(item[key])) {
      list.push(item)
      tempMap.set(item[key], item.trans)
    }
  })
  return { list, listLocal }
}

const getData = async (lang) => {
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
  let { list, listLocal } = await mergeList(NOUN_PATH_LOCAL, NOUN_PATH, 'keyword')
  sortKeywords(list, 'keyword').forEach(item => {
    nounMap.set(item.keyword, {
      trans: item.trans,
      ignoreCase: !item.cs
    })
  })
  if (!listLocal.length) {
    writeCsv(NOUN_PATH_LOCAL, list)
  }
}

readNoun()

const nameFileChange = debounce((file) => {
  const lang = file.match(/-(en|jp)\.csv$/)[1]
  getData(lang)
}, 1000)

const nounFileChange = debounce((file) => {
  readNoun()
}, 1000)

setTimeout(() => {
  chokidar.watch(['local/npc-name-*.csv'], { 
    cwd: userDataPath 
  }).on('change', nameFileChange)
  chokidar.watch(['local/noun.csv'], { 
    cwd: userDataPath 
  }).on('change', nounFileChange)
}, 3000)

module.exports = nameData