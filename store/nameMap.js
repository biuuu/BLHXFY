const { readCsv, sortKeywords } = require('../utils/')
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

const NAME_EN_PATH = path.resolve(__dirname, '../data', 'npc-name-en.csv')
const NAME_JP_PATH = path.resolve(__dirname, '../data', 'npc-name-jp.csv')
const NAME_EN_PATH_LOCAL = path.resolve(cwd, 'local', 'npc-name-en.csv')
const NAME_JP_PATH_LOCAL = path.resolve(cwd, 'local', 'npc-name-jp.csv')
const NOUN_PATH = path.resolve(__dirname, '../data', 'noun.csv')

const getData = async (lang) => {
  const pathLocal = lang === 'en' ? NAME_EN_PATH_LOCAL : NAME_JP_PATH_LOCAL
  const pathStable = lang === 'en' ? NAME_EN_PATH : NAME_JP_PATH
  let listLocal = []
  let listStable = []
  const list = []
  const tempMap = new Map()
  try {
    listLocal = await readCsv(pathLocal)
  } catch (e) {

  } finally {
    listStable = await readCsv(pathStable)
  }
  listStable.concat(listLocal).forEach(item => {
    if (!tempMap.get(item.name)) {
      list.push(item)
      tempMap.set(item.name, item.trans)
    }
  })
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

readCsv(NOUN_PATH).then(data => {
  sortKeywords(data, 'keyword').forEach(item => {
    nounMap.set(item.keyword, {
      trans: item.trans,
      ignoreCase: !item.cs
    })
  })
})

const fileChange = debounce((file) => {
  const lang = file.match(/-(en|jp)\.csv$/)[1]
  getData(lang)
}, 1000)

setTimeout(() => {
  chokidar.watch(['local/npc-name-*.csv', 'data/npc-name-*.csv'], { cwd })
    .on('change', fileChange)
}, 3000)

module.exports = nameData