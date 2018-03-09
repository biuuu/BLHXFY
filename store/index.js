const path = require('path')
const { app } = require('electron')

exports.USER_DATA_PATH = app 
  ? path.resolve(app.getPath('userData'))
  : path.resolve(process.cwd(), 'userData')