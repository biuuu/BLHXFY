import getSkillData, { skillKeys, getLocalSkillData, getCommSkillMap, saveAutoTrans } from '../store/skill-npc'
import replaceTurn from '../utils/replaceTurn'
import transBuff from './buff'
import { splitSingleLineSkill, getPlusStr, trim } from '../utils/'
import config from '../config'
import filter from '../utils/XSSFilter'

const elemtRE = '([光闇水火風土無全]|light|dark|water|wind|earth|fire|plain|all)'
const elemtMap = {
  light: '光', '光': '光',
  dark: '暗', '闇': '暗',
  water: '水', '水': '水',
  wind: '风', '風': '风',
  earth: '土', '土': '土',
  fire: '火', '火': '火',
  plain: '无', '無': '无',
  all: '全', '全': '全'
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
  if (!result) return comment
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
  saveAutoTrans()
  return result
}

const previewSkill = (npcId) => {
  jQuery('#cnt-detail')
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

const repalceSkillText = function(ability, key1, key2, skillData, translated, changed) {
  if (ability.recast_comment) {
    ability.recast_comment = replaceTurn(ability.recast_comment)
  }
  if (ability.recast_additional_comment) {
    ability.recast_additional_comment.replace('リンクアビリティで連動', 'Link技能')
  }

  const abilityName = changed === 'ex' ? 'ex-' + ability.name : ability.name
  const [plus1, plus2, name] = getPlusStr(abilityName)
  let trans = skillData[`skill-${abilityName}`] || skillData[`skill-${name}`]
  if (!trans) {
    trans = skillData[`special-${abilityName}`] || skillData[`special-${name}`]
    if (!trans) {
      let list = skillData[key2 + '-lv']
      list && list.forEach(item => {
        if (level >= item.level) {
          trans = item.data
        }
      })
      if (!trans) {
        trans = skillData[key2 + plus2]
        if (!trans && !changed) {
          trans = skillData[key2]
        }
      }
    }
  }

  if (!trans) return

  if (trans.name) {
    ability.name = trans.name + plus1
  }
  if (trans.detail) {
    const detail = trans.detail
    const rep = new RegExp(config.defaultName, 'g')
    const uname = config.displayName || config.userName
    const text = filter(detail.replace(rep, uname))
    ability.comment = text
    translated.set(key1, true)
  }
}

const parseSkill = async (data, pathname) => {
  if (Game.lang === 'en') return data
  let npcId
  let level
  if (pathname.includes('/npc/npc/')) {
    if (!data.master || !data.master.id) return data
    npcId = `${data.master.id}`
    level = data.param.level
  } else if (pathname.includes('/archive/npc_detail')) {
    if (!data.id) return data
    npcId = data.id
    level = data.max_level
  }

  previewSkill(npcId)

  let skillState = getLocalSkillData(npcId)
  if (!skillState) {
    skillState = await getSkillData(npcId)
  }
  const skillData = skillState.skillMap.get(npcId)
  const translated = new Map()
  const keys = skillState.skillKeys

  let lbCount = 0
  for (let item of keys) {
    const key1 = item[0]
    const key2 = item[1]
    let ability = data[key1]

    if (!ability || (Array.isArray(ability) && !ability.length)) {
      if (!data.ability) continue
      ability = data.ability[key1]
      if (!ability || (Array.isArray(ability) && !ability.length)) continue
    }

    if (key1 === 'support_ability_of_npczenith' && !Array.isArray(ability)) {
      let lbLoopCount = 0
      let abTemp = ability
      for (let _k in ability) {
        if (lbCount <= lbLoopCount) {
          ability = ability[_k]
          lbCount++
          break
        }
        lbLoopCount++
      }
      if (abTemp === ability) {
        continue
      }
    }

    if (key2 !== 'special' && !key2.startsWith('skill-lb')) {
      const matched = key2.match(/(\d)$/)
      const order = matched ? matched[1] : '1'
      ability = ability[order]
      if (!ability) {
        continue
      }
    }

    await transBuff(ability.ability_detail)

    if (!skillData) continue

    const extraSkillKeys = ['display_action_ability_info', 'form_change_display_action_ability_info', 'select_display_action_ability_info']
    for (let extraKey of extraSkillKeys) {
      if (ability[extraKey] && ability[extraKey].action_ability) {
        const changedSkills = ability[extraKey].action_ability
        for (let item of changedSkills) {
          await transBuff(item.ability_detail)
          if (item.action_id !== ability.action_id) {
            if (item.name === ability.name) {
              // 因为切换后的技能名跟原技能名相同，所以必须给技能名加上 ex 标识来区分
              repalceSkillText(item, key1, key2, skillData, translated, 'ex')
            } else {
              repalceSkillText(item, key1, key2, skillData, translated, 'changed')
            }
          } else {
            repalceSkillText(item, key1, key2, skillData, translated)
          }
        }
      }
    }

    repalceSkillText(ability, key1, key2, skillData, translated)
  }

  if (skillData) {
    if (data.master) {
      const trans = skillData['npc']
      if (trans && trans.name) {
        data.master.name = trans.name
        if (data.master.short_name === data.master.name) {
          data.master.short_name = trans.name
        }
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

export { transSkill }
export default parseSkill
