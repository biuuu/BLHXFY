const glob = require('glob')
const path = require('path')
const { readCsv, readJson } = require('../utils/')
const chokidar = require('chokidar')
const { USER_DATA_PATH, dataPath } = require('./index')

const scenarioMap = new Map()

const reCollectScenario = async () => {
  const DATA_PATH = await dataPath()
  const data = await readJson(path.resolve(DATA_PATH, 'manifest.json'))
  if (data) {
    for (let key in data) {
      scenarioMap.set(key, {
        filename: data[key],
        stable: true
      })
    }
    return true
  }
  return false
}

const state = {
  status: 'init',
  map: scenarioMap,
  reCollectScenario
}

const readInfo = async (file, stable) => {
  const csvPath = stable ? path.resolve(__dirname, '../data', file) : path.resolve(USER_DATA_PATH, file)
  const list = await readCsv(csvPath)
  const filename = path.basename(file)
  const rlist = list.reverse()
  for (let row of rlist) {
    if (row.id === 'info') {
      scenarioMap.set(row.trans, {
        stable,
        trans: row.trans,
        jp: row.jp,
        en: row.en,
        filename
      })
      break
    }
  }
}

glob('local/scenario/*.csv', { cwd: USER_DATA_PATH }, async (err, files) => {
  try {
    await Promise.all(files.map(file => {
      return readInfo(file, false)
    }))
  } catch (err) {
    console.error(`${err.message}\n${err.stack}`)
  }
  const DATA_PATH = await dataPath()
  const hasPack = await reCollectScenario()
  if (!hasPack) {
    glob('scenario/*.csv', { cwd: DATA_PATH }, (err, files) => {
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

setTimeout(() => {
  chokidar.watch('local/scenario/*.csv', {
    cwd: USER_DATA_PATH,
    ignoreInitial: true
  }).on('add', file => {
    readInfo(file)
  })
}, 5000)

module.exports = state