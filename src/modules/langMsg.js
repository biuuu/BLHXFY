import getLangMsgData from '../store/lang-msg'
import { race } from '../utils'

const transLangMsg = async function (data, pathname) {
  if (!data.option || !data.option.langMsg) return data
  const lang = Game.lang
  const msgs = data.option.langMsg
  const langMsgMap = await getLangMsgData()
  for (let key of Object.keys(msgs)) {
    const msg = langMsgMap.get(`${lang === 'ja' ? '' : key}${msgs[key].msg}`)
    if (msg && msg.trans) {
      msgs[key].msg = msg.trans
    }
  }
  return data
}

export default race(transLangMsg)