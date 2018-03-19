const rimraf = require('rimraf')
const path = require('path')

const cachePath = path.resolve(process.env.HOME, './.anyproxy/cache')
module.exports = (cb) => {
  rimraf(cachePath, cb)
}