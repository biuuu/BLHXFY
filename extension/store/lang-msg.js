import fetchData from '../fetch'
import { getLocalData, setLocalData } from './local-data'
import parseCsv from '../utils/parseCsv'
import sortKeywords from '../utils/sortKeywords'

const langMsgMap = new Map()
let loaded = false

const nameWithScenario = (list, key = 'name') => {
  const newList = []
  const keys = []
  list.forEach(item => {
    const existIdx = keys.indexOf(item[key])
    if (existIdx !== -1) {
      const obj = newList[existIdx]
      if (item.scenario) {
        obj[item.scenario] = item
        obj.scenarios.push(item.scenario)
      } else {
        obj.trans = item.trans
        obj.noun = !!item.noun
      }
    } else {
      const obj = { [key]: item[key], scenarios: [] }
      if (item.scenario) {
        obj[item.scenario] = item
        obj.scenarios.push(item.scenario)
      } else {
        obj.trans = item.trans
        obj.noun = !!item.noun
      }
      newList.push(obj)
      keys.push(item[key])
    }
  })
  return newList
}

const getLangMsgData = async () => {
  if (!loaded) {
    let langMsg = getLocalData('langMsg')
    if (!langMsg) {
      langMsg = await fetchData('/blhxfy/data/lang-msg.csv')
      setLocalData('langMsg', langMsg)
    }
    const list = parseCsv(langMsg)
    list.forEach(item => {
      if (item.id && item.id.trim()) {
        item.en && langMsgMap.set(`${item.id}${item.en}`, {
          trans: item.trans,
          en: item.en,
          jp: item.jp
        })
        item.jp && langMsgMap.set(`${item.jp}`, {
          trans: item.trans,
          en: item.en,
          jp: item.jp
        })
      }
    })
    loaded = true
  }
  return langMsgMap
}

export default getLangMsgData
