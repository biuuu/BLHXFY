const rimraf = require('rimraf')
const path = require('path')
const os = require('os')

const cachePath = path.resolve(os.homedir(), './.anyproxy/cache')
module.exports = (cb, onlyFile) => {
  let targetPath = cachePath
  if (onlyFile) {
    targetPath = path.resolve(cachePath, './cache*/*')
  }
  
  rimraf(targetPath, cb)
}