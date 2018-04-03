const glob = require('glob')
const path = require('path')
const chokidar = require('chokidar')
const { STATIC_PATH, dataPath } = require('../store')
const startServer = require('../utils/staticServer')
const CONFIG = require('../config')
const fse = require('fs-extra')
const { app } = require('electron')

const staticMap = new Map()

try {
  if (app) {
    fse.copySync(path.resolve(__dirname, '../data/static/default/'), path.resolve(STATIC_PATH, 'default/'))
  }
} catch (err) {
  console.error(`${err.message}\n${err.stack}`)
}

const collectFiles = (type, once) => {
  glob(`${type}/**/*`, {
    cwd: STATIC_PATH,
    nodir: true
  }, (err, files) => {
    if (!err) {
      files.forEach((filePath) => {
        const key = filePath.replace(type, '')
        if (!staticMap.has(key)) {
          staticMap.set(key, filePath)
        }
      })
    }
    if (!once && type !== 'default') collectFiles('default')
  })
}

const reCollectFiles = async () => {
  const DATA_PATH = await dataPath()
  try {
    await fse.copy(path.resolve(DATA_PATH, 'static/default/'), path.resolve(STATIC_PATH, 'default/'))
  } catch (err) {
    console.error(`${err.message}\n${err.stack}`)
  }
  collectFiles('default', true)
}

collectFiles('local')

const watchFile = (type) => {
  chokidar.watch(`${type}/**/?*`, {
    cwd: STATIC_PATH,
    ignored: /(^|[\/\\])\../,
    ignoreInitial: true
  }).on('add', file => {
    const key = file.replace(/\\/g, '/').replace(type, '')
    staticMap.set(key, `${type}${key}`)
  }).on('unlink', file => {
    const key = file.replace(/\\/g, '/').replace(type, '')
    if (staticMap.has(key)) {
      staticMap.delete(key)
    }
    if (type === 'local') {
      collectFiles(type, true)
    }
  }).on('error', error => console.error(`Watcher error: ${error}`))
}

fse.pathExists(path.resolve(STATIC_PATH, 'local'), (err, exists) => {
  if (!exists) {
    fse.copy(path.resolve(__dirname, '../assets/tips.png'), path.resolve(STATIC_PATH, 'local/assets/img/sp/quest/assist/parts/tips.png'))
    staticMap.set('/assets/img/sp/quest/assist/parts/tips.png', 'local/assets/img/sp/quest/assist/parts/tips.png')
  }
})

setTimeout(() => {
  watchFile('local')
  watchFile('default')
}, 3000)

if (!app) startServer(STATIC_PATH, CONFIG.staticPort)

module.exports = {
  staticMap,
  reCollectFiles
}