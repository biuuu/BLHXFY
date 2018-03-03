const glob = require('glob')
const path = require('path')
const { readCsv } = require('../utils/')
const chokidar = require('chokidar')

const scenarioMap = new Map()

const state = {
  status: 'init',
  map: scenarioMap
}

const readInfo = async (file, stable) => {
  const csvPath = stable ? path.resolve(__dirname, '../', file) : path.resolve(process.cwd(), file)
  const list = await readCsv(csvPath)
  const filename = path.basename(file, '.csv')
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

glob('local/scenario/*.csv', (err, files) => {
  Promise.all(files.map(file => {
    return readInfo(file, false)
  })).then(() => {
    glob('data/scenario/*.csv', (err, files) => {
      Promise.all(files.map(file => {
        return readInfo(file, true)
      })).then(() => {
        state.status = 'loaded'
      })
    })
  })
})

setTimeout(() => {
  chokidar.watch('local/scenario/*.csv', {
    cwd: path.resolve(process.cwd())
  }).on('add', file => {
    readInfo(file)
  })
  chokidar.watch('data/scenario/*.csv', {
    cwd: path.resolve(process.cwd())
  }).on('add', file => {
    readInfo(file, true)
  })
}, 5000)

module.exports = state