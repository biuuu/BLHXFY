import getSkillData, { skillKeys, getLocalSkillData, getCommSkillMap } from '../store/skill-npc'
import replaceTurn from '../utils/replaceTurn'
import transBuff from './buff'
import { splitSingleLineSkill, getPlusStr, trim } from '../utils/'

const elemtRE = '([光闇水火風土無]|light|dark|water|wind|earth|fire|plain)'
const elemtMap = {
  light: '光', '光': '光',
  dark: '暗', '闇': '暗',
  water: '水', '水': '水',
  wind: '风', '風': '风',
  earth: '土', '土': '土',
  fire: '火', '火': '火',
  plain: '无', '無': '无'
}
const numRE = '(\\d{1,10}\\.?\\d{0,4}?)'
const percentRE = '(\\d{1,10}\\.?\\d{0,4}?[%％])'

const parseRegExp = (str, nounRE) => {
  return str.replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)').replace(/\$elemt/g, elemtRE)
    .replace(/\$num/g, numRE)
    .replace(/\$percent/g, percentRE)
    .replace(/\$noun/g, nounRE)
}

const transSkill = (comment, { commSkillMap, nounMap, nounRE, autoTransCache }) => {
  if (autoTransCache.has(comment)) return autoTransCache.get(comment)
  let result = comment
  for (let [key, value] of commSkillMap) {
    if (!trim(key)) continue
    const { trans, type } = value
    if (type === '1') {
      const re = new RegExp(parseRegExp(key, nounRE), 'gi')
      result = result.replace(re, (...arr) => {
        let _trans = trans
        for (let i = 1; i < arr.length - 2; i++) {
          let eleKey = arr[i].toLowerCase()
          if (elemtMap[eleKey]) {
            _trans = _trans.replace(`$${i}`, elemtMap[eleKey])
          } else if (nounMap.has(eleKey)) {
            _trans = _trans.replace(`$${i}`, nounMap.get(eleKey))
          } else {
            _trans = _trans.replace(`$${i}`, arr[i])
          }
        }
        return _trans
      })
    } else if (type === '2') {
      let res, i = 0
      while (res !== result && i < 10) {
        res = result
        result = result.replace(key, trans)
        i++
      }
    } else if (type === '3') {
      result = result.replace(`(${key})`, `(${trans})`)
    }
  }
  autoTransCache.set(comment, result)
  return result
}

const parseBuff = async (data) => {
  for (let item of skillKeys) {
    const key = item[0]
    let ability = data[key]
    if (!ability) {
      if (!data.ability) continue
      ability = data.ability[key]
      if (!ability) continue
    }
    if (ability.ability_detail) {
      await transBuff(ability.ability_detail)
    }
  }
}

const previewSkill = (npcId) => {
  $('#cnt-detail')
  .off('click.blhxfy')
  .on('click.blhxfy', '.prt-evolution-star>div:eq(1)', function () {
    const csv = window.prompt('粘贴要预览的技能翻译CSV文本')
    if (csv) {
      sessionStorage.setItem('blhxfy:skill-preview', JSON.stringify({
        id: npcId,
        csv: splitSingleLineSkill(csv)
      }))
      location.reload()
    }
  }).on('click.blhxfy', '.prt-evolution-star>div:eq(2)', function () {
    if (confirm('清除技能预览？')) {
      sessionStorage.removeItem('blhxfy:skill-preview')
      location.reload()
    }
  })
}

const parseSkill = async (data, pathname) => {
  if (Game.lang === 'en') return data
  let npcId
  if (pathname.includes('/npc/npc/')) {
    if (!data.master || !data.master.id) return data
    npcId = `${data.master.id}`
  } else if (pathname.includes('/archive/npc_detail')) {
    if (!data.id) return data
    npcId = data.id
  }

  await parseBuff(data)
  previewSkill(npcId)

  let skillState = getLocalSkillData(npcId)
  if (!skillState) {
    skillState = await getSkillData(npcId)
  }
  const skillData = skillState.skillMap.get(npcId)
  const translated = new Map()
  const keys = skillState.skillKeys
  if (skillData) {
    for (let item of keys) {
      const key1 = item[0]
      const key2 = item[1]
      let ability = data[key1]
      if (!ability) {
        if (!data.ability) continue
        ability = data.ability[key1]
        if (!ability) continue
      }

      if (ability.recast_comment) {
        ability.recast_comment = replaceTurn(ability.recast_comment)
      }
      const [plus1, plus2] = getPlusStr(ability.name)
      let trans = skillData[`skill-${ability.name}`]
      if (!trans) {
        trans = skillData[`special-${ability.name}`]
        if (!trans) {
          trans = skillData[key2 + plus2]
          if (!trans) {
            trans = skillData[key2]
            if (!trans) continue
          }
        }
      }
      if (trans.name) {
        ability.name = trans.name + plus1
      }
      if (trans.detail) {
        ability.comment = trans.detail
        translated.set(key1, true)
      }
    }

    if (data.master) {
      const trans = skillData['npc']
      if (trans && trans.name) {
        data.master.name = trans.name
        const intro = skillData['intro']
        if (intro && intro.name) data.master.evo_name = `[${intro.name}]${trans.name}`
      }
    } else if (data.name) {
      const trans = skillData['npc']
      if (trans && trans.name) {
        data.name = trans.name
        const intro = skillData['intro']
        if (intro && intro.name) data.evo_name = `[${intro.name}]${trans.name}`
      }
    }
    if (data.comment) {
      const trans = skillData['intro']
      if (trans && trans.detail) data.comment = trans.detail
    }
  }

  await getCommSkillMap()
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
