const { readCsv, writeCsv } = require('../../utils/')
const path = require('path')
const { USER_DATA_PATH } = require('../../store/')
const skillState = require('../../store/skillMap')
const users = require('../../store/users')

const { skillMap, skillKeys } = skillState
const keys = skillKeys

const saveSkill = async (data) => {
  if (!data || !data.id || !data.master || !data.master.name || !data.master.id) return
  const name = `${data.master.evo_name || data.master.name}-${data.id}.csv`
  const list = []
  const FILE_PATH = path.resolve(USER_DATA_PATH, 'local/skill/', name)
  list.push({
    id: 'npc',
    name: data.master.name,
    detail: `${data.id}|${data.master.id}`
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
  let _str = str
  while (_str.endsWith('+') || _str.endsWith('＋')) {
    plusStr += '＋'
    _str = _str.slice(0, _str.length - 1)
  }
  return plusStr
}

const transSkill = async (data, lang) => {
  if (skillState.status !== 'loaded' || !data.id) return data
  const npcId = `${data.id}`
  const skillData = skillMap.get(npcId)
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
      const trans = skillData[key2]
      if (!trans) return
      if (trans.name) {
        const str = getPlusStr(data[key1].name)
        data[key1].name = trans.name + str
      }
      if (trans.detail) data[key1].comment = trans.detail
    })
    if (data.master) {
      const trans = skillData['npc']
      if (trans && trans.name) data.master.name = trans.name
    }
  } else if (lang === 'jp') {
    saveSkill(data)
  }
  return data
}

const parseData = async (data, uid) => {
  const currentUser = users.get(uid)
  const lang = currentUser ? currentUser.lang : 'jp'
  const result = await transSkill(data, lang)
  return data
}

module.exports = parseData
