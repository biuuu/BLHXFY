
import getArcarumData from '../store/arcarum'
import debounce from 'lodash/debounce'

let arcarumMap = new Map()

let textTempArr = []
const debounceLog = debounce(() => {
  if (!textTempArr.length) return
  const text = textTempArr.join(',\n')
  console.info(text + ',')
  textTempArr = []
}, 200)

const replaceText = (key, data) => {
  if (data && data[key]) {
    let text = data[key].replace(/<br\s?\/?>/gi, '').replace(/\r?\n/g, '')

    if (arcarumMap.has(text)) {
      data[key] = arcarumMap.get(text)
    } else {
      let _text = data[key].replace(/\r?\n/g, '')
      if (!textTempArr.includes(_text)) {
        textTempArr.push(_text)
      }
      debounceLog()
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

const transDivisionList = (list) => {
  for (let key in list) {
    const item = list[key]
    replaceText('text', item)
    replaceListText('message', item.gatepost_list)
    replaceListText('message', item.chest_list)
    for (let qlk in item.quest_list) {
      replaceText('quest_name', item.quest_list[qlk])
      replaceText('chapter_name', item.quest_list[qlk])
    }
  }
}

const transArcarum = async (data) => {
  arcarumMap = await getArcarumData()
  replaceText('group_name', data.condition)
  replaceText('name', data.stage)
  if (data.map && data.map.division_list) {
    transDivisionList(data.map.division_list)
  }
  if (data.notice_effect) {
    for (let key in data.notice_effect) {
      let obj = data.notice_effect[key]
      if (obj && obj.maps) {
        obj.maps.forEach(map => {
          if (map.division_list) {
            transDivisionList(map.division_list)
          }
        })
      }
    }
  }
  return data
}

export default transArcarum
