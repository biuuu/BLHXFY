const rimraf = require('rimraf')
const path = require('path')
const os = require('os')

let cachePath = path.resolve(os.homedir(), './.anyproxy/cache')
module.exports = (cb, onlyFile) => {
  if (onlyFile) {
    cachePath += '/cache*/*'
  }
  rimraf(cachePath, cb)
}