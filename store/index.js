const path = require('path')
const { app } = require('electron')
const fs = require('fs')

const cwd = process.cwd()

const USER_DATA_PATH = app
  ? path.resolve(app.getPath('userData'))
  : path.resolve(cwd, 'userData')

exports.USER_DATA_PATH = USER_DATA_PATH
exports.STATIC_PATH = app
  ? path.resolve(app.getPath('userData'), 'data/static/')
  : path.resolve(cwd, './data/static/')

exports.LOCAL_CONFIG_PATH = path.resolve(USER_DATA_PATH, 'config.json')

const getPackname = async () => {
  if (!app) return null
  const filePath = path.resolve(app.getPath('userData'), './data/manifest.json')
  let packname = null
  try {
    const str = await new Promise((rev, rej) => {
      fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) rej(err)
        rev(data)
      })
    })
    packname = JSON.parse(str).packname
  } catch (err) {
    console.error(`${err.message}\n${err.stack}`)
  }
  return packname
}

exports.getPackname = getPackname

exports.dataPath = async () => {
  const name = await getPackname()
  if (name) {
    return path.resolve(app.getPath('userData'), `./data/`)
  }
  return path.resolve(__dirname, '../data/')
}
