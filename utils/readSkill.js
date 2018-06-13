const path = require('path')
const CONFIG = require('../config')
const { readCsv } = require('./index')
const { USER_DATA_PATH, dataPath } = require('../store/')
const { skillKeys } = require('../store/skillMap')

const readSkill = async (filename, stable) => {
  const csvPath = stable
    ? path.resolve(await dataPath(), 'skill', `${filename}`)
    : path.resolve(USER_DATA_PATH, `local/skill`, `${filename}`)
  const list = await readCsv(csvPath)
  const transMap = new Map()
  list.forEach(item => {
    if (item.id) {
      skillKeys.forEach((key, idx) => {
        if (key[1] === item.id) {
          transMap.set(key[0], {
            name: item.nameTrans,
            comment: item.detail
          })
        }
      })
    }
  })
  return transMap
}

module.exports = readSkill
