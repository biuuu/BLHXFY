const { readCsv, writeCsv } = require('../../utils/')
const path = require('path')
const { USER_DATA_PATH } = require('../../store/')
const skillState = require('../../store/skillMap')
const users = require('../../store/users')
const { cloneDeep } = require('lodash')
const transSkill = require('../../utils/transSkill')

const { skillMap, skillKeys } = skillState
const keys = skillKeys

const saveSkill = async (data) => {
  if (!data || !data.master || !data.master.name || !data.master.id) return
  const name = `${data.master.evo_name || data.master.name}-${data.master.id}.csv`
  const list = []
  const FILE_PATH = path.resolve(USER_DATA_PATH, 'local/skill/', name)
  list.push({
    id: 'npc',
    name: data.master.name,
    detail: `${data.master.id}`
  })

  keys.forEach(key => {
    const skill = data[key[0]]
    const id = key[1]
    if (skill) {
      const name = skill.name.replace(/[+＋]{1,2}$/, '').trim()
      list.push({ id, name, nameTrans: '', detail: skill.comment })
    }
  })
  list.push({
    id: 'active',
    name: '0',
    detail: ''
  })
  await writeCsv(FILE_PATH, list)
}

const getPlusStr = (str) => {
  let plusStr = ''
  let plusStr2 = ''
  let _str = str
  while (_str.endsWith('+') || _str.endsWith('＋')) {
    plusStr += '＋'
    plusStr2 += '+'
    _str = _str.slice(0, _str.length - 1)
  }
  return [plusStr, plusStr2]
}

const parseSkill = async (data, lang) => {
  if (skillState.status !== 'loaded' || !data.master || !data.master.id) return data
  const npcId = `${data.master.id}`
  const skillData = skillMap.get(npcId)
  const cData = cloneDeep(data)
  const translated = new Map()
  if (skillData) {
    keys.forEach(item => {
      const key1 = item[0]
      const key2 = item[1]
      if (!data[key1]) return
      if (data[key1].recast_interval_comment) {
        data[key1].recast_interval_comment = data[key1]
          .recast_interval_comment
          .replace('ターン', '回合').replace('turns', '回合')
          .replace('turn', '回合').replace('Cooldown:', '使用间隔:').replace('使用間隔:', '使用间隔:')
      }
      if (data[key1].effect_time_comment) {
        data[key1].effect_time_comment = data[key1]
          .effect_time_comment
          .replace('ターン', '回合').replace('turns', '回合')
          .replace('turn', '回合')
      }
      const [plus1, plus2] = getPlusStr(data[key1].name)
      let trans = skillData[key2 + plus2]
      if (!trans) {
        trans = skillData[key2]
        if (!trans) return
      }
      if (trans.name) {
        data[key1].name = trans.name + plus1
      }
      if (trans.detail) {
        data[key1].comment = trans.detail
        translated.set(key1, true)
      }
    })
    if (data.master) {
      const trans = skillData['npc']
      if (trans && trans.name) data.master.name = trans.name
    }
  } else if (lang === 'jp') {
    saveSkill(cData)
  }
  keys.forEach(item => {
    if (!translated.get(item[0])) {
      const skill = data[item[0]]
      if (skill) {
        skill.comment = transSkill(skill.comment_en)
      }
    }
  })
  return data
}

const parseData = async (data, uid) => {
  const currentUser = users.get(uid)
  const lang = currentUser ? currentUser.lang : 'jp'
  const result = await parseSkill(data, lang)
  return data
}

module.exports = parseData
