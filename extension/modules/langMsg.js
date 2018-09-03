import getLangMsgData from '../store/lang-msg'

export default async function transLangMsg(data, pathname) {
  if (!data.option || !data.option.langMsg) return data

  const msgs = data.option.langMsg
  const langMsgMap = await getLangMsgData()
  for (let key of Object.keys(msgs)) {
    const msg = langMsgMap.get(`${key}${msgs[key].msg}`)
    if (msg && msg.trans) {
      msgs[key].msg = msg.trans
    }
  }
  return data
}
