const { download } = require('electron-dl')
const CONFIG = require('../config')
const axios = require('axios')
const { getPackname, USER_DATA_PATH } = require('../store/')
const path = require('path')
const fs = require('fs-extra')
const { getData, readNoun } = require('../store/nameMap')
const { reCollectScenario } = require('../store/scenarioState')
const { reCollectFiles } = require('../store/staticMap')

const reCollectData = () => {
  getData('en')
  getData('jp')
  readNoun()
  reCollectScenario()
  reCollectFiles()
}

const updatePkg = async (packname, win) => {
  const pkgUrl = `https://${CONFIG.csvHost}/blhxfy/${packname}`
  await fs.ensureDir(path.resolve(USER_DATA_PATH, 'data/'))
  const dl = await download(win, pkgUrl, {
    directory: path.resolve(USER_DATA_PATH, 'data/'),
    filename: packname,
    errorTitle: '更新翻译数据失败',
    errorMessage: '下载 {filename} 已中断'
  })
  await fs.writeFile(path.resolve(USER_DATA_PATH, 'data/manifest.json'), JSON.stringify({ packname }, null, 2))
  reCollectData()
}

const checkUpdate = async (win) => {
  const manifestUrl = `https://${CONFIG.csvHost}/blhxfy/manifest.json`
  try {
    const res = await axios.get(manifestUrl)
    const packname = res.data.filename
    const currentPackname = getPackname()
    if (packname && packname !== currentPackname) {
      await updatePkg(packname, win)
    }
  } catch (err) {
    console.error(`${err.message}\n${err.stack}`)
  }
  setTimeout(() => {
    checkUpdate(win)
  }, 10 * 60 * 1000)
}

module.exports = checkUpdate