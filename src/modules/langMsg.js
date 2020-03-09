import getPhrase from '../store/phrase'

export default async function transLangMsg(data) {
  if (!data.option || !data.option.langMsg) return data
  const msgs = data.option.langMsg
  const phraseMap = await getPhrase()
  for (let key of Object.keys(msgs)) {
    let text = msgs[key].msg
    if (text && phraseMap.has(text)) {
      msgs[key].msg = phraseMap.get(text)
    }
  }
  return data
}
