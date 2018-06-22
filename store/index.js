const path = require('path')
const { app } = require('electron')
const fs = require('fs')
const CONFIG = require('../config')

const cwd = process.cwd()

const DATA_DIR_NAME = CONFIG.lang === 'hans' ? 'data' : 'data-hant'

const USER_DATA_PATH = app
  ? path.resolve(app.getPath('userData'))
  : path.resolve(cwd, 'userData')

exports.DATA_DIR_NAME = DATA_DIR_NAME
exports.USER_DATA_PATH = USER_DATA_PATH
exports.STATIC_PATH = app
  ? path.resolve(USER_DATA_PATH, `${DATA_DIR_NAME}/static/`)
  : path.resolve(cwd, './data/static/')

exports.LOCAL_CONFIG_PATH = path.resolve(USER_DATA_PATH, 'config.json')

const getPackname = async () => {
  if (!app) return null
  const filePath = path.resolve(USER_DATA_PATH, `./${DATA_DIR_NAME}/manifest.json`)
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
    return path.resolve(USER_DATA_PATH, `./${DATA_DIR_NAME}/`)
  }
  return path.resolve(__dirname, '../data/')
}
