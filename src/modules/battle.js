
import getSkillData from '../store/skill-job'
import isObject from 'lodash/isObject'
import isArray from 'lodash/isArray'
import replaceTurn from '../utils/replaceTurn'
import getNpcSkillData, { getCommSkillMap, skillState } from '../store/skill-npc'
import { getPlusStr, removeHtmlTag, race } from '../utils/'
import CONFIG from '../config'
import { transSkill } from './skill-npc'
import getBossName from '../store/name-boss'

const skillTemp = new Map()
const posMap = new Map()
let bossNameMap = new Map()

const collectNpcSkill = (skillData) => {
  for (let key in skillData) {
    if (/(skill|special)-\D.*/.test(key)) {
      const rgs = key.match(/(skill|special)-(\D.*)/)
      if (rgs && rgs[2] && !skillTemp.has(rgs[2])) {
        skillTemp.set(rgs[2], skillData[key])
      }
    }
  }
}

const replaceMonsterName = (item, key) => {
  const name = item[key].replace(/^Lvl?\s?[\d?]+\s+/, '')
  if (bossNameMap.has(name)) {
    const trans = bossNameMap.get(name)
    item[key] = item[key].replace(name, trans)
  }
}

const transBossName = async (data) => {
  if (data && isArray(data.param)) {
    data.param.forEach(item => {
      replaceMonsterName(item, 'monster')
      replaceMonsterName(item.name, 'en')
      replaceMonsterName(item.name, 'ja')
    })
  }
}

const battle = async function battle(data, mode) {
  if (!CONFIG.battleTrans) return data
  let ability
  let scenario
  let spms

  bossNameMap = await getBossName()
  if (mode === 'result') {
    if (isObject(data.status)) {
      ability = data.status.ability
      spms = data.status.skip_special_motion_setting
    }
  } else {
    ability = data.ability
    spms = data.skip_special_motion_setting
    data.temporary_potion_all_name = '群体回复药水'
    data.temporary_potion_one_name = '治疗药水'
    await transBossName(data.boss)
  }
  if (isArray(spms)) {
    spms.forEach(item => {
      posMap.set(item.pos, item.setting_id)
    })
  }

  if (isObject(data.scenario)) scenario = data.scenario

  await getCommSkillMap()
  // translate skill
  if (isObject(ability)) {
    for (let abKey in ability) {
      let item = ability[abKey]
      if (item && isObject(item.list)) {
        if (item.mode === 'player') {
          for (let key in item.list) {
            let arr = item.list[key]
            let skill = arr[0]
            if (skill && skill['ability-name']) {
              const name = skill['ability-name']
              const trans = await getSkillData(name)
              if (trans) {
                if (!skillTemp.has(name)) skillTemp.set(name, trans)
                skill['ability-name'] = trans.name
                skill['text-data'] = trans.detail
              } else {
                const tsDetail = await transSkill(skill['text-data'], skillState)
                skill['text-data'] = tsDetail
                if (!skillTemp.has(name)) skillTemp.set(name, { name, detail: tsDetail })
              }
              skill['duration-type'] = replaceTurn(skill['duration-type'])
            }
          }
        } else if (item.mode === 'npc') {
          const npcId = posMap.get(item.pos)
          const state = await getNpcSkillData(npcId)
          const skillData = state.skillMap.get(npcId)
          if (skillData && isObject(item.list)) {
            collectNpcSkill(skillData)
            let index = 0
            for (let key in item.list) {
              index++
              let arr = item.list[key]
              let skill = arr[0]
              if (skill && skill['ability-name']) {
                const name = skill['ability-name']
                const [plus1, plus2, _name] = getPlusStr(name)
                if (skillData[`skill-${_name}`]) {
                  let trans = skillData[`skill-${_name}${plus2}`]
                  if (!trans) trans = skillData[`skill-${_name}`]
                  let tsName = name
                  let tsDetail = skill['text-data']
                  if (trans) {
                    if (trans.name) tsName = trans.name + plus1
                    if (trans.detail) tsDetail = trans.detail
                  }
                  if (tsDetail === skill['text-data']) {
                    tsDetail = await transSkill(skill['text-data'], state)
                    skill['text-data'] = tsDetail
                  }
                  skill['ability-name'] = tsName
                  skill['text-data'] = tsDetail
                  skillTemp.set(name, { name: getPlusStr(tsName)[2], detail: tsDetail })
                } else {
                  let trans = skillData[`skill-${index}${plus2}`]
                  if (!trans) trans = skillData[`skill-${index}`]
                  let tsName = name
                  let tsDetail = skill['text-data']
                  if (trans) {
                    if (trans.name) tsName = trans.name + plus1
                    if (trans.detail) tsDetail = trans.detail
                  }
                  if (tsDetail === skill['text-data']) {
                    tsDetail = await transSkill(skill['text-data'], state)
                    skill['text-data'] = tsDetail
                  }
                  skill['ability-name'] = tsName
                  skill['text-data'] = tsDetail
                  skillTemp.set(name, { name: getPlusStr(tsName)[2], detail: tsDetail })
                }
                skill['duration-type'] = replaceTurn(skill['duration-type'])
              }
            }
          } else {
            for (let key in item.list) {
              let arr = item.list[key]
              let skill = arr[0]
              if (skill && skill['ability-name'] && skill['text-data']) {
                const name = skill['ability-name']
                const detail = await transSkill(skill['text-data'], state)
                skill['text-data'] = detail
                skillTemp.set(name, { name: getPlusStr(name)[2], detail })
              }
            }
          }
        }
      }
    }
  }
  // translate speciall skill
  if (mode !== 'result' && data.player && isArray(data.player.param)) {
    const param = data.player.param
    let index = 0
    for (let item of param) {
      const npcId = posMap.get(index)
      index++
      const state = await getNpcSkillData(npcId)
      const skillData = state.skillMap.get(npcId)
      if (skillData) {
        collectNpcSkill(skillData)
        if (item.name) {
          if (skillData.npc && skillData.npc.name) {
            item.name = skillData.npc.name
          } else if (bossNameMap.has(item.name)) {
            item.name = bossNameMap.get(item.name)
          }
        }
        if (item['special_skill']) {
          const name = item['special_skill']
          const [plus1, plus2, _name] = getPlusStr(name)
          if (skillData[`special-${_name}`]) {
            let trans = skillData[`special-${_name}${plus2}`]
            if (!trans) trans = skillData[`special-${_name}`]
            let tsName = name
            let tsDetail = item['special_comment']
            if (trans) {
              if (trans.name) tsName = trans.name + plus1
              if (trans.detail) tsDetail = trans.detail
            }
            if (tsDetail === item['special_comment']) {
              tsDetail = await transSkill(item['special_comment'], state)
              item['special_comment'] = tsDetail
            }
            item['special_skill'] = tsName
            item['special_comment'] = tsDetail
            skillTemp.set(name, { name: getPlusStr(tsName)[2], detail: tsDetail })
          } else {
            let trans = skillData[`special${plus2}`]
            if (!trans) trans = skillData[`special`]
            let tsName = name
            let tsDetail = item['special_comment']
            if (trans) {
              if (trans.name) tsName = trans.name + plus1
              if (trans.detail) tsDetail = trans.detail
            }
            if (tsDetail === item['special_comment']) {
              tsDetail = await transSkill(item['special_comment'], state)
              item['special_comment'] = tsDetail
            }
            item['special_skill'] = tsName
            item['special_comment'] = tsDetail
            skillTemp.set(name, { name: getPlusStr(tsName)[2], detail: tsDetail })
          }
        }
      } else {
        if (item['special_skill'] && item['special_comment']) {
          const name = item['special_skill']
          const detail = await transSkill(item['special_comment'], state)
          item['special_comment'] = detail
          skillTemp.set(name, { name: getPlusStr(name)[2], detail })
        }
      }
    }
  }
  // translate summon
  if (data.summon && isArray(data.summon)) {
    for (let item of data.summon) {
      if (item) {
        if (item.comment) {
          item.comment = await transSkill(item.comment, skillState)
        }
        if (item.protection) {
          item.protection = await transSkill(item.protection, skillState)
        }
      }
    }
  }
  if (data.supporter && data.supporter.name) {
    data.supporter.comment = await transSkill(data.supporter.comment, skillState)
    data.supporter.detail = await transSkill(data.supporter.detail, skillState)
    data.supporter.protection = await transSkill(data.supporter.protection, skillState)
  }
  // translate scenario
  if (scenario) {
    for (let scKey in scenario) {
      let item = scenario[scKey]
      if (item && item.name) {
        if (item.cmd === 'ability') {
          const trans = skillTemp.get(item.name)
          const [plus1] = getPlusStr(item.name)
          if (trans) {
            item.name = trans.name + plus1
            item.comment = trans.detail
          }
        } else if (item.cmd === 'special_npc') {
          const trans = skillTemp.get(item.name)
          const [plus1] = getPlusStr(item.name)
          if (trans) {
            item.name = trans.name + plus1
          }
        } else if (item.cmd === 'special_change') {
          const [plus1, plus2, _name] = getPlusStr(item.name)
          let trans = skillTemp.get(item.name)
          if (!trans) trans = skillTemp.get(_name)
          let tsName = item.name
          let tsDetail = item.text
          if (trans) {
            if (trans.name) tsName = trans.name + plus1
            if (trans.detail) tsDetail = trans.detail
          }
          if (tsDetail === item.text) {
            tsDetail = await transSkill(item.text, skillState)
            item.text = tsDetail
          }
          item.name = tsName
          item.text = tsDetail
          skillTemp.set(name, { name: getPlusStr(tsName)[2], detail: tsDetail })
        } else if (item.cmd === 'boss_gauge') {
          replaceMonsterName(item.name, 'ja')
          replaceMonsterName(item.name, 'en')
        }
      }
    }
  }

  return data
}

const transBattle = race(battle)

const transBattleR = async (data) => {
  return await transBattle(data, 'result')
}

export { transBattleR }
export default transBattle
