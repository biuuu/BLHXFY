import getSkillData from '../store/skill-npc'
import replaceTurn from '../utils/replaceTurn'

const elemtRE = '([光闇水火風土]|light|dark|water|wind|earth|fire)'
const elemtMap = {
  light: '光', '光': '光', 'dark': '暗', '闇': '暗', 'water': '水', '水': '水',
  wind: '风', '風': '风', 'earth': '土', '土': '土', 'fire': '火', '火': '火'
}
const numRE = '(\\d{1,4})'
const percentRE = '(\\d{1,4}%)'

const parseRegExp = (str) => {
  return str.replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)').replace(/\$elemt/g, elemtRE)
    .replace(/\$num/g, numRE)
    .replace(/\$percent/g, percentRE)
}

const transSkill = (comment, { commSkillMap, autoTransCache }) => {
  if (autoTransCache.has(comment)) return autoTransCache.get(comment)
  let result = comment
  for (let [key, value] of commSkillMap) {
    if (!key.trim()) continue
    const { trans, type } = value
    if (type === '1') {
      const re = new RegExp(parseRegExp(key), 'gi')
      result = result.replace(re, (...arr) => {
        let _trans = trans
        for (let i = 1; i < arr.length - 2; i++) {
          let eleKey = arr[i].toLowerCase()
          if (elemtMap[eleKey]) {
            _trans = _trans.replace(`$${i}`, elemtMap[eleKey])
          } else {
            _trans = _trans.replace(`$${i}`, arr[i])
          }
        }
        return _trans
      })
    } else if (type === '2') {
      result = result.replace(key, trans)
    } else if (type === '3') {
      result = result.replace(`(${key})`, `(${trans})`)
    }
  }
  autoTransCache.set(comment, result)
  return result
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

const parseSkill = async (data, pathname) => {
  let npcId
  if (pathname.includes('/npc/npc/')) {
    if (!data.master || !data.master.id) return data
    npcId = `${data.master.id}`
  } else if (pathname.includes('/archive/npc_detail')) {
    if (!data.id) return data
    npcId = data.id
  }

  const skillState = await getSkillData(npcId)
  if (!skillState) return data
  const skillData = skillState.skillMap.get(npcId)
  const translated = new Map()
  const keys = skillState.skillKeys
  if (skillData) {
    keys.forEach(item => {
      const key1 = item[0]
      const key2 = item[1]
      let ability = data[key1]
      if (!ability) {
        if (!data.ability) return
        ability = data.ability[key1]
        if (!ability) return
      }
      if (ability.recast_comment) {
        ability.recast_comment = replaceTurn(ability.recast_comment)
      }
      const [plus1, plus2] = getPlusStr(ability.name)
      let trans = skillData[key2 + plus2]
      if (!trans) {
        trans = skillData[key2]
        if (!trans) return
      }
      if (trans.name) {
        ability.name = trans.name + plus1
      }
      if (trans.detail) {
        ability.comment = trans.detail
        translated.set(key1, true)
      }
    })
    if (data.master) {
      const trans = skillData['npc']
      if (trans && trans.name) data.master.name = trans.name
    } else if (data.name) {
      const trans = skillData['npc']
      if (trans) data.name = trans.name
    }
    if (data.comment) {
      const trans = skillData['intro']
      if (trans) data.comment = trans.detail
    }
  }
  keys.forEach(item => {
    if (!translated.get(item[0])) {
      const skill = data[item[0]]
      if (skill) {
        skill.comment = transSkill(skill.comment, skillState)
      }
    }
  })
  return data
}

export default parseSkill
