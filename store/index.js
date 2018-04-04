const path = require('path')
const { app } = require('electron')

const cwd = process.cwd()

exports.USER_DATA_PATH = app 
  ? path.resolve(app.getPath('userData'))
  : path.resolve(cwd, 'userData')

exports.STATIC_PATH = app
  ? path.resolve(app.getPath('userData'), './static/')
  : path.resolve(cwd, './data/static/')
