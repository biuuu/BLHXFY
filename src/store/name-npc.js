import fetchData from '../fetch'
import parseCsv from '../utils/parseCsv'
import sortKeywords from '../utils/sortKeywords'
import filter from '../utils/XSSFilter'
import { trim } from '../utils/'
import CONFIG from '../config'

const enNameMap = new Map()
const jpNameMap = new Map()
const nounMap = new Map()
const nounFixMap = new Map()
const caiyunPrefixMap = new Map()
let loaded = false
let nounLoaded = false

const checkVersion = (str) => {
  if (/^\(v\d+_\d+_\d+\).+/.test(str)) {
    let rgs = str.match(/^\(v(\d+)_(\d+)_(\d+)\)(.+)/)
    return { 
      version: [rgs[1], rgs[2], rgs[3]],
      text: rgs[4]
    }
  }
  return false
}

const versionPass = (ver) => {
  let arr = CONFIG.version.split('.')
  let res = [arr[0] - ver[0], arr[1] - ver[1], arr[2] - ver[2]]
  return res[0] > 0 || (res[0] === 0 && res[1] > 0) || ( res[0] === 0 && res[1] === 0 && res[2] >= 0)
}

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
        obj.trans = filter(item.trans)
        obj.noun = !!item.noun
      }
    } else {
      const obj = { [key]: item[key], scenarios: [] }
      if (item.scenario) {
        obj[item.scenario] = item
        obj.scenarios.push(item.scenario)
      } else {
        obj.trans = filter(item.trans)
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
    const nameEn = await fetchData('/blhxfy/data/npc-name-en.csv')
    const nameJp = await fetchData('/blhxfy/data/npc-name-jp.csv')
    const listEn = nameWithScenario(parseCsv(nameEn))
    const listJp = nameWithScenario(parseCsv(nameJp))
    sortKeywords(listEn, 'name').forEach(item => {
      enNameMap.set(item.name, item)
    })
    sortKeywords(listJp, 'name').forEach(item => {
      jpNameMap.set(item.name, item)
    })
    loaded = true
  }
  return { enNameMap, jpNameMap }
}

const getNounData = async () => {
  if (!nounLoaded) {
    const noun = await fetchData('/blhxfy/data/noun.csv')
    const nounFix = await fetchData('/blhxfy/data/noun-fix.csv')
    const caiyunPrefix = await fetchData('/blhxfy/data/caiyun-prefix.csv')
    const listNoun = parseCsv(noun)
    const listNounFix = parseCsv(nounFix)
    const listCaiyunPrefix = parseCsv(caiyunPrefix)

    sortKeywords(listNoun, 'keyword').forEach(item => {
      const keyword = trim(item.keyword)
      const trans = filter(item.trans)
      if (keyword && trans) {
        nounMap.set(keyword, {
          trans,
          ignoreCase: !item.cs
        })
      }
    })
    sortKeywords(listNounFix, 'text').forEach(item => {
      const text = trim(item.text)
      const fix = filter(item.fixed)
      if (text) {
        let result = checkVersion(text)
        if (result) {
          if (versionPass(result.version)) {
            nounFixMap.set(result.text, fix)
          }
        } else {
          nounFixMap.set(text, fix)
        }
      }
    })
    sortKeywords(listCaiyunPrefix, 'text').forEach(item => {
      const text = trim(item.text)
      const fix = filter(item.fixed)
      if (text && fix) {
        caiyunPrefixMap.set(text, fix)
      }
    })
    nounLoaded = true
  }
  return { nounMap, nounFixMap, caiyunPrefixMap }
}

export default getNameData
export { getNounData }
