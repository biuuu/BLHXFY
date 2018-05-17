const glob = require('glob')
const path = require('path')
const chokidar = require('chokidar')
const { STATIC_PATH, dataPath } = require('../store')
const startServer = require('../utils/staticServer')
const CONFIG = require('../config')
const fse = require('fs-extra')
const { app } = require('electron')

const staticMap = new Map()

fse.ensureDirSync(STATIC_PATH)

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

setTimeout(() => {
  watchFile('local')
  watchFile('default')
}, 3000)

if (!app) startServer(STATIC_PATH, CONFIG.staticPort)

module.exports = {
  staticMap,
  reCollectFiles
}
