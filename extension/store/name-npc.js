import fetchData from '../fetch'
import { getLocalData, setLocalData } from './local-data'
import parseCsv from '../utils/parseCsv'
import sortKeywords from '../utils/sortKeywords'

const enNameMap = new Map()
const jpNameMap = new Map()
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

const getNameData = async () => {
  if (!loaded) {
    let nameEn = getLocalData('nameEn')
    let nameJp = getLocalData('nameJp')
    if (!nameEn) {
      nameEn = await fetchData('/blhxfy/data/npc-name-en.csv')
      setLocalData('nameEn', nameEn)
    }
    if (!nameJp) {
      nameJp = await fetchData('/blhxfy/data/npc-name-jp.csv')
      setLocalData('nameJp', nameJp)
    }
    const listEn = nameWithScenario(parseCsv(nameEn))
    const listJp = nameWithScenario(parseCsv(nameJp))
    sortKeywords(listEn).forEach(item => {
      enNameMap.set(item.name, item)
    })
    sortKeywords(listJp).forEach(item => {
      jpNameMap.set(item.name, item)
    })
    loaded = true
  }
  return { enNameMap, jpNameMap }
}

export default getNameData