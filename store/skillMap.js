const glob = require('glob')
const path = require('path')
const { readCsv, readJson } = require('../utils/')
const chokidar = require('chokidar')
const { USER_DATA_PATH, dataPath } = require('./index')
const fse = require('fs-extra')
const { debounce } = require('lodash')

const skillMap = new Map()
const skillNameMap = new Map()

const skillKeys = [
  ['special_skill', 'special'],
  ['action_ability1', 'skill-1'],
  ['action_ability2', 'skill-2'],
  ['action_ability3', 'skill-3'],
  ['action_ability4', 'skill-4'],
  ['support_ability1', 'support-1'],
  ['support_ability2', 'support-2'],
  ['support_ability_of_npczenith', 'skill-lb']
]

const keys = ['skill-1', 'skill-2', 'skill-3', 'skill-4', 'special']

const state = {
  status: 'init',
  skillMap, skillNameMap,
  skillKeys
}

const setSkillMap = (list, stable) => {
  let npcId, active, idArr
  for (let row of list) {
    if (row.id === 'npc') {
      idArr = row.detail.split('|')
    } else if (row.id === 'active') {
      if (row.name !== '0') {
        active = true
      }
    }
  }

  if (!idArr.length || !idArr[0]) return
  npcId = idArr[1] || idArr[0]
  const skillData = {}
  const fullData = {}
  for (let row of list) {
    if (stable || active) {
      if (keys.includes(row.id)) {
        skillData[row.id] = row
      }
      fullData[row.id] = row
    }
  }
  state.skillMap.set(npcId, fullData)
  state.skillNameMap.set(npcId, skillData)
}

const reCollectSkill = async () => {
  const DATA_PATH = await dataPath()
  const data = await readJson(path.resolve(DATA_PATH, 'skill.json'))
  if (data) {
    for (let key in data) {
      const csvPath = path.resolve(DATA_PATH, 'skill', data[key])
      const list = await readCsv(csvPath)
      setSkillMap(list, true)
    }
    state.status = 'loaded'
    return true
  }
  return false
}

state.reCollectSkill = reCollectSkill

const readInfo = async (file, stable) => {
  const DATA_PATH = await dataPath()
  const csvPath = stable ? path.resolve(DATA_PATH, file) : path.resolve(USER_DATA_PATH, file)
  const list = await readCsv(csvPath)
  setSkillMap(list)
}

glob('local/skill/*.csv', { cwd: USER_DATA_PATH }, async (err, files) => {
  try {
    await Promise.all(files.map(file => {
      return readInfo(file, false)
    }))
    state.status = 'loaded'
  } catch (err) {
    console.error(`${err.message}\n${err.stack}`)
  }
  const DATA_PATH = await dataPath()
  const hasPack = await reCollectSkill()
  if (!hasPack) {
    glob('skill/**/*.csv', { cwd: DATA_PATH }, (err, files) => {
      Promise.all(files.map(file => {
        return readInfo(file, true)
      })).then(() => {
        state.status = 'loaded'
      })
    })
  } else {
    state.status = 'loaded'
  }
})

fse.ensureDirSync(path.resolve(USER_DATA_PATH, 'local/skill/'))

const deReadInfo = debounce(readInfo, 500)

setTimeout(() => {
  chokidar.watch('local/skill/*.csv', {
    cwd: USER_DATA_PATH,
    ignoreInitial: true
  }).on('add', file => {
    deReadInfo(file)
  }).on('change', file => {
    deReadInfo(file)
  }).on('unlink', file => {
    const filename = path.basename(file, '.csv')
    const key = filename.match(/.+-(\d+)$/)
    if (key && key[1]) {
      skillMap.delete(key[1])
    }
  })
}, 5000)

module.exports = state
