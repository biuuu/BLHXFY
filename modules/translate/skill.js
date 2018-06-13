const { readCsv, writeCsv } = require('../../utils/')
const path = require('path')
const { USER_DATA_PATH } = require('../../store/')
const skillState = require('../../store/skillMap')
const readSkill = require('../../utils/readSkill')
const users = require('../../store/users')

const { skillMap, skillKeys } = skillState
const keys = skillKeys

const saveSkill = async (data) => {
  if (!data || !data.id || !data.master || !data.master.name) return
  const name = `${data.master.evo_name || data.master.name}-${data.id}.csv`
  const list = []
  const FILE_PATH = path.resolve(USER_DATA_PATH, 'local/skill/', name)
  list.push({
    id: 'npc',
    name: data.master.name,
    nameTrans: '',
    detail: data.id
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
    nameTrans: '',
    detail: ''
  })
  await writeCsv(FILE_PATH, list)
}

const transSkill = async (data, lang) => {
  if (skillState.status !== 'loaded' || !data.id) return data
  const npcId = `${data.id}`
  const skillData = skillMap.get(npcId)
  if (skillData) {
    const { filename, stable, active } = skillData
    if (stable || active) {

      const transMap = await readSkill(filename, stable)
      keys.forEach(item => {
        const key = item[0]
        const trans = transMap.get(key)
        if (!trans) return
        if (trans.name) data[key].name = trans.name
        if (trans.comment) data[key].comment = trans.comment
      })
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
