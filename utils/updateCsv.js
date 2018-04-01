const { download } = require('electron-dl')
const CONFIG = require('../config')
const axios = require('axios')
const { getPackname, USER_DATA_PATH } = require('../store/')
const path = require('path')

const reCollectData = () => {

}

const updatePkg = async (packname, win) => {
  const pkgUrl = `https://${CONFIG.csvHost}/data/${packname}`
  const dl = await download(win, pkgUrl, {
    directory: path.resolve(USER_DATA_PATH, 'data'),
    filename: packname,
    errorTitle: '更新翻译数据失败',
    errorMessage: '下载 {filename} 已中断'
  })
  await fs.writeFile(path.resolve(USER_DATA_PATH, 'data'), JSON.stringify({ packname }, null, 2))
  reCollectData()
}

const checkUpdate = async (win) => {
  const manifestUrl = `https://${CONFIG.csvHost}/data/manifest.json`
  try {
    const res = await axios.get(manifestUrl)
    const packname = res.data.packname
    const currentPackname = getPackname()
    if (packname !== currentPackname) {
      await updatePkg(packname, win)
    }
  } catch (err) {
    console.error(err)
  }
  setTimeout(() => {
    checkUpdate(win)
  }, 10 * 60 * 1000)
}

module.exports = checkUpdate