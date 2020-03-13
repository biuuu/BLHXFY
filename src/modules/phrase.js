import getPhrase from '../store/phrase'

const transPhrase = (data, key, map) => {
  if (!data || !data[key]) return
  let text = data[key]
  if (map.has(text)) {
    data[key] = map.get(text)
  }
}

const shopLabel = async (data) => {
  if (data && data.labels && data.labels.length) {
    const phraseMap = await getPhrase()
    data.labels.forEach(item => {
      transPhrase(item, 'name', phraseMap)
      if (item.contents && item.contents.length) {
        item.contents.forEach(cont => {
          transPhrase(cont, 'name', phraseMap)
        })
      }
    })
  }
}

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

export { shopLabel }