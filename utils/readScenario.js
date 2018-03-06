const path = require('path')
const CONFIG = require('../config')
const { readCsv, replaceWords } = require('./index')

const readScenario = async ({ filename, stable }, userName) => {
  const csvPath = stable 
    ? path.resolve(__dirname, '../data/scenario', `${filename}.csv`)
    : path.resolve(CONFIG.userDataPath, `local/scenario`, `${filename}.csv`)
  const list = await readCsv(csvPath)
  const transMap = new Map()
  list.forEach(item => {
    if (item.id) {
      const idArr = item.id.split('-')
      const id = idArr[0]
      const type = idArr[1] || 'detail'
      const obj = transMap.get(id) || {}
      obj[type] = replaceWords(item.trans, new Map([[CONFIG.yourName, userName]]), 'zh')
      transMap.set(id, obj)
    }
  })
  return transMap
}

module.exports = readScenario