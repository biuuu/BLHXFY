const path = require('path')
const CONFIG = require('../config')
const { readCsv } = require('./index')
const { USER_DATA_PATH, dataPath } = require('../store/')
const { skillKeys } = require('../store/skillMap')

const keys = skillKeys.map(item => item[1])
const readSkill = async (filename, stable) => {
  const csvPath = stable
    ? path.resolve(await dataPath(), 'skill', `${filename}`)
    : path.resolve(USER_DATA_PATH, `local/skill`, `${filename}`)
  const list = await readCsv(csvPath)
  const transMap = new Map()
  list.forEach(item => {
    if (item.id) {
      if (keys.includes(item.id)) {
        transMap.set(item.id, {
          name: item.name,
          comment: item.detail
        })
      } else if (item.id === 'npc') {
        transMap.set('npc', {
          name: item.name
        })
      }
    }
  })
  return transMap
}

module.exports = readSkill
