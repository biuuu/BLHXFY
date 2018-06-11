const path = require('path')
const { writeCsv, readCsv, sortByStr } = require('./index')
const { USER_DATA_PATH } = require('../store/')

const saveLangMsg = async (msgs, lang) => {
  if (!lang) return
  const FILE_PATH = path.resolve(USER_DATA_PATH, 'local/', `lang-msg.csv`)
  let list = []
  try {
    list = await readCsv(FILE_PATH)
  } catch (err) {
    if (err.code !== 'ENOENT') {
      return
    }
  }
  const nameList = list.map(item => item.id)
  let needSave = false
  msgs.forEach(item => {
    const idx = nameList.indexOf(item.id)
    if (idx === -1) {
      const data = {
        id: item.id,
        jp: lang === 'jp' ? item.msg : '',
        en: lang === 'en' ? item.msg : '',
        trans: ''
      }
      list.push(data)
      needSave = true
    } else if (!list[idx][lang]) {
      list[idx][lang] = item.msg
      needSave = true
    }
  })
  if (needSave) {
    list = sortByStr(list, 'id').filter(item => !!item.id)
    await writeCsv(FILE_PATH, list)
  }
}

module.exports = saveLangMsg
