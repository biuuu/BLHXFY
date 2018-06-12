const path = require('path')
const CONFIG = require('../config')
const { readCsv, replaceWords } = require('./index')
const { USER_DATA_PATH, dataPath } = require('../store/')

const readScenario = async ({ filename, stable }, userName) => {
  const csvPath = stable
    ? path.resolve(await dataPath(), './scenario', `${filename}`)
    : path.resolve(USER_DATA_PATH, `local/scenario`, `${filename}`)
  const list = await readCsv(csvPath)
  const transMap = new Map()
  list.forEach(item => {
    if (item.id) {
      const idArr = item.id.split('-')
      const id = idArr[0]
      const type = idArr[1] || 'detail'
      const obj = transMap.get(id) || {}
      obj[type] = replaceWords(item.trans, new Map([[CONFIG.yourName, CONFIG.displayName || userName || '古兰']]), 'zh')
      transMap.set(id, obj)
    }
  })
  return transMap
}

module.exports = readScenario
