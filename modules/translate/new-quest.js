const googleTrans = require('../../api/google')
const { replaceName } = require('../../utils/')

module.exports = async (data) => {
  if (!data.option.quest || !data.option.quest.content__select) return data
  let contentIndex = decodeURIComponent(data.option.quest.content__select)
  let questName = contentIndex.match(/data-quest-name="([^"]*)"/)[1]
  let synopsis = contentIndex.match(/data-synopsis="([^"]*)"/)[1]
  
  const result = await googleTrans(replaceName(`${questName}\n${synopsis}`))
  ;[questName, synopsis] = result.split('\n')
  const text = contentIndex
    .replace(/data-quest-name="([^"]*)"/, `data-quest-name="${questName}"`)
    .replace(/data-quest-name="([^"]*)"/, `data-quest-name="${questName}"`)
    .replace(/data-synopsis="([^"]*)"/, `data-synopsis="${synopsis}"`)
  data.option.quest.content__select = encodeURIComponent(text)
  return data
}