import fetchData from '../fetch'
import parseCsv from '../utils/parseCsv'
import sortKeywords from '../utils/sortKeywords'

const skillMap = new Map()

const skillKeys = [
  ['special_skill', 'special'],
  ['action_ability1', 'skill-1'],
  ['action_ability2', 'skill-2'],
  ['action_ability3', 'skill-3'],
  ['action_ability4', 'skill-4'],
  ['support_ability1', 'support-1'],
  ['support_ability2', 'support-2'],
  ['support_ability_of_npczenith', 'skill-lb']
]

const keys = ['skill-1', 'skill-2', 'skill-3', 'skill-4', 'special']

const state = {
  status: 'init',
  cStatus: 'init',
  skillMap,
  skillKeys,
  skillData: null,
  commSkillMap: new Map(),
  autoTransCache: new Map()
}

const getCommSkillMap = async () => {
  if (state.cStatus === 'loaded') return
  const csvData = await fetchData('/blhxfy/data/common-skill.csv')
  const list = await parseCsv(csvData)
  const sortedList = sortKeywords(list, 'comment')
  sortedList.forEach(item => {
    if (item.comment && item.trans && item.type) {
      const comment = item.comment.trim()
      const trans = item.trans.trim()
      const type = item.type.trim() || '1'
      if (comment && trans) {
        state.commSkillMap.set(comment, { trans, type })
      }
    }
  })
  state.cStatus = 'loaded'
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
      skillData[row.id] = row
    }
  }
  state.skillMap.set(npcId, skillData)
}

const getSkillData = async (npcId) => {
  await getCommSkillMap()
  if (!state.skillData) {
    state.skillData = await fetchData('/blhxfy/data/skill.json')
  }
  const csvName = state.skillData[npcId]
  if (csvName) {
    const csvData = await fetchData(`/blhxfy/data/skill/${csvName}`)
    const list = parseCsv(csvData)
    setSkillMap(list)
  }
  return state
}

export default getSkillData
export { skillKeys }
