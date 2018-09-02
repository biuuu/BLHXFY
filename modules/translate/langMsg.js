const { readCsv, writeCsv } = require('../../utils/')
const users = require('../../store/users')
const { nameData } = require('../../store/nameMap')
const saveLangMsg = require('../../utils/saveLangMsg')

const { langMsgMap } = nameData

const parseData = async (data, uid) => {
  if (!data.option || !data.option.langMsg) return data
  const currentUser = users.get(uid)
  const lang = currentUser ? currentUser.lang : 'jp'

  const list = []
  const msgs = data.option.langMsg
  for (let key of Object.keys(msgs)) {
    const msg = langMsgMap.get(`${key}${msgs[key].msg}`)
    if (msg) {
      if ((!msg.en && lang === 'en') || (!msg.jp && lang === 'jp')) {
        msgs[key].msg && list.push({ id: key, msg: msgs[key].msg, trans: msg.trans })
      }
      if (msg.trans) {
        msgs[key].msg = msg.trans
      }
    } else if (key && msgs[key].msg) {
      list.push({ id: key, msg: msgs[key].msg })
    }
  }
  if (list.length) {
    saveLangMsg(list, lang)
  }
  return data
}

module.exports = parseData
