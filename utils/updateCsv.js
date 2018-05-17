const { download } = require('electron-dl')
const CONFIG = require('../config')
const axios = require('axios')
const { getPackname, USER_DATA_PATH } = require('../store/')
const path = require('path')
const fs = require('fs-extra')
const { getData, readNoun } = require('../store/nameMap')
const { reCollectScenario } = require('../store/scenarioState')
const { reCollectFiles } = require('../store/staticMap')
const DecompressZip = require('decompress-zip')

const decompressFile = (filename, target, cb) => {
  var unzipper = new DecompressZip(filename)

  unzipper.on('error', function (err) {
      console.error(err)
  })

  unzipper.on('extract', function (log) {
      console.log('Finished extracting')
      cb && cb()
  })

  // unzipper.on('progress', function (fileIndex, fileCount) {
  //     console.log('Extracted file ' + (fileIndex + 1) + ' of ' + fileCount)
  // })

  unzipper.extract({
      path: target,
      filter: function (file) {
        return file.type !== "SymbolicLink"
      }
  })
}

const reCollectData = (packname) => {
  const filename = path.resolve(USER_DATA_PATH, 'tmpFile/', packname)
  const target = path.resolve(USER_DATA_PATH, 'data/')
  decompressFile(filename, target, function () {
    getData('en')
    getData('jp')
    readNoun()
    reCollectScenario()
    reCollectFiles()
  })
}

const updatePkg = async (packname, win) => {
  win.webContents.send('update-csv', true)
  const pkgUrl = `https://${CONFIG.csvHost}/blhxfy/${packname}`
  await fs.emptyDir(path.resolve(USER_DATA_PATH, 'tmpFile/'))
  try {
    const dl = await download(win, pkgUrl, {
      directory: path.resolve(USER_DATA_PATH, 'tmpFile/'),
      filename: packname,
      errorTitle: '更新翻译数据失败',
      errorMessage: '下载 {filename} 已中断'
    })
    const manifestPath = path.resolve(USER_DATA_PATH, 'data/manifest.json')
    await fs.ensureFile(manifestPath)
    await fs.writeJson(manifestPath, { packname })
    reCollectData(packname)
  } finally {
    win.webContents.send('update-csv', false)
  }
}

const checkUpdate = async (win) => {
  const manifestUrl = `https://${CONFIG.csvHost}/blhxfy/manifest.json`
  try {
    const res = await axios.get(manifestUrl)
    const packname = res.data.packname
    const currentPackname = await getPackname()
    if (packname && packname !== currentPackname) {
      await updatePkg(packname, win)
    }
  } catch (err) {
    console.error(`${err.message}\n${err.stack}`)
  }
  setTimeout(() => {
    checkUpdate(win)
  }, 60 * 1000 * 10)
}

module.exports = checkUpdate
