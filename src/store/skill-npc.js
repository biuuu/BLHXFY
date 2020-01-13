import fetchData from '../fetch'
import parseCsv from '../utils/parseCsv'
import sortKeywords from '../utils/sortKeywords'
import filter from '../utils/XSSFilter'
import { trim } from '../utils/'
import { getLocalData, setLocalData } from './local-data'
import debounce from 'lodash/debounce'

const skillMap = new Map()

const skillKeys = [
  ['special_skill', 'special'],
  ['action_ability1', 'skill-1'],
  ['action_ability2', 'skill-2'],
  ['action_ability3', 'skill-3'],
  ['action_ability4', 'skill-4'],
  ['support_ability1', 'support-1'],
  ['support_ability2', 'support-2'],
  ['support_ability_of_npczenith', 'skill-lb'],
  ['appear_ability', 'skill-main'],
  ['backmember_ability1', 'skill-sub']
]

const keys = ['skill-1', 'skill-2', 'skill-3', 'skill-4', 'special']

const state = {
  status: 'init',
  cStatus: 'init',
  locSkMap: false,
  locASMap: false,
  skillMap,
  skillKeys,
  skillData: null,
  commSkillMap: new Map(),
  autoTransCache: new Map(),
  nounMap: new Map(),
  nounRE: ''
}

const getCommSkillMap = async () => {
  if (state.cStatus === 'loaded') return
  let csvData = await getLocalData('comm-skill')
  if (!csvData) {
    csvData = await fetchData('/blhxfy/data/common-skill.csv')
    setLocalData('comm-skill', csvData)
  }
  const list = await parseCsv(csvData)
  const sortedList = sortKeywords(list, 'comment')
  let nounArr = []
  sortedList.forEach(item => {
    if (item.comment && item.trans && item.type) {
      const comment = trim(item.comment)
      const trans = filter(item.trans)
      const type = trim(item.type) || '1'
      if (comment && trans) {
        if (type === '4') {
          state.nounMap.set(comment, trans)
          nounArr.push(comment)
        } else {
          state.commSkillMap.set(comment, { trans, type })
        }
      }
    }
  })
  if (nounArr.length) state.nounRE = `(${nounArr.join('|')})`
  state.cStatus = 'loaded'
}

const saveSkillMap = async (skillMap) => {
  const arr = [...skillMap].slice(-20)
  setLocalData('skill-npc', JSON.stringify(arr))
}

const getSkillMap = async () => {
  const str = await getLocalData('skill-npc')
  try {
    const arr = JSON.parse(str)
    state.skillMap = new Map(arr)
    for (let [key, item] of state.skillMap) {
      for (let _key in item) {
        item[_key].name = filter(item[_key].name)
        item[_key].detail = filter(item[_key].detail)
      }
    }
    state.locSkMap = true
  } catch (e) {

  }
}

const saveAutoTrans = debounce(() => {
  const arr = [...state.autoTransCache].slice(-200)
  setLocalData('auto-trans', JSON.stringify(arr))
}, 500)

const getAutoTrans = async () => {
  const str = await getLocalData('auto-trans')
  try {
    const arr = JSON.parse(str)
    state.autoTransCache = new Map(arr)
    for (let [key, item] of state.autoTransCache) {
      state.autoTransCache.set(key, filter(item))
    }
    state.locASMap = true
  } catch (e) {

  }
}

const saveSkillPath = async (skillData) => {
  setLocalData('skill-path', JSON.stringify(skillData))
}

const getSkillPath = async () => {
  const str = await getLocalData('skill-path')
  try {
    const data = JSON.parse(str)
    state.skillData = data
  } catch (e) {

  }
}

const setSkillMap = (list, stable = true) => {
  let npcId, active, idArr
  for (let row of list) {
    if (row.id === 'npc') {
      idArr = row.detail.split('|')
    } else if (row.id === 'active') {
      if (row.name !== '0') {
        active = true
      }
    }
  }

  if (!idArr.length || !idArr[0]) return
  npcId = idArr[1] || idArr[0]
  const skillData = {}
  for (let row of list) {
    if (stable || active) {
      if (/.+\[lv\d+\]/.test(row.id)) {
        let rgs = row.id.match(/(.+)\[lv(\d+)\]/)
        let key = rgs[1]
        let level = parseInt(rgs[2])
        let list = skillData[key + '-lv'] || []
        if (!skillData[key + '-lv']) skillData[key + '-lv'] = list
        list.push({ level, data: row })
        list.sort((m, n) => m.level - n.level)
      } else {
        skillData[row.id] = row
      }
    }
  }
  state.skillMap.set(npcId, skillData)
  saveSkillMap(state.skillMap)
}

const getSkillData = async (npcId) => {
  if (!state.locSkMap) await getSkillMap()
  if (!state.locASMap) await getAutoTrans()
  if (state.skillMap.has(npcId)) return state
  await getSkillPath()
  if (!state.skillData) {
    state.skillData = await fetchData('/blhxfy/data/skill.json')
    saveSkillPath(state.skillData)
  }
  const csvName = state.skillData[npcId]
  if (csvName) {
    const csvData = await fetchData(`/blhxfy/data/skill/${csvName}`)
    const list = parseCsv(filter(csvData))
    setSkillMap(list)
  }
  return state
}

const getLocalSkillData = (npcId) => {
  const str = sessionStorage.getItem('blhxfy:skill-preview')
  if (str) {
    try {
      const data = JSON.parse(str)
      if (data.id === npcId) {
        const csv = filter(data.csv)
        const list = parseCsv(csv)
        list.forEach(item => {
          if (item.id === 'npc') {
            item.detail = npcId
          }
        })
        setSkillMap(list)
        return state
      }
    } catch (err) {
      console.error(err)
    }
  }
  return false
}

export default getSkillData
export { skillKeys, getLocalSkillData, getCommSkillMap, saveAutoTrans, state as skillState }
