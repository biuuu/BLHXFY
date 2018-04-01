const path = require('path')
const { app } = require('electron')
const fs = require('fs')

const cwd = process.cwd()

exports.USER_DATA_PATH = app 
  ? path.resolve(app.getPath('userData'))
  : path.resolve(cwd, 'userData')

exports.STATIC_PATH = app
  ? path.resolve(app.getPath('userData'), './static/')
  : path.resolve(cwd, './data/static/')

exports.getPackname = async () => {
  const filePath = path.resolve(app.getPath('userData'), './data/manifest.json')
  let packname = null
  try {
    const str = await new Promise((rev, rej) => {
      fs.readFile(csvPath, 'utf-8', (err, data) => {
        if (err) rej(err)
        rev(data)
      })
    })
    packname = JSON.parse(str).packname
  } catch (err) {
    console.error(err)
  }
  return packname
}