
import getArcarumData from '../store/arcarum'

let arcarumMap = new Map()

const replaceText = (key, data) => {
  if (data && data[key]) {
    let text = data[key].replace(/<br\s?\/?>\r?\n/gi, '')
    if (arcarumMap.has(text)) {
      data[key] = arcarumMap.get(text)
    }
  }
}

const replaceListText = (key, list) => {
  if (list && list.length) {
    list.forEach(item => {
      if (Array.isArray(key)) {
        key.forEach(k => {
          replaceText(k, item)
        })
      } else {
        replaceText(key, item)
      }
    })
  }
}

const transArcarum = async (data) => {
  arcarumMap = await getArcarumData()
  replaceText('group_name', data.condition)
  replaceText('name', data.stage)
  if (data.map && data.map.division_list) {
    for (let key in data.map.division_list) {
      const item = data.map.division_list[key]
      replaceText('text', item)
      replaceListText('message', item.gatepost_list)
      replaceListText('message', item.chest_list)
      for (let qlk in item.quest_list) {
        replaceText('quest_name', item.quest_list[qlk])
        replaceText('chapter_name', item.quest_list[qlk])
      }
    }
  }
  return data
}

export default transArcarum
