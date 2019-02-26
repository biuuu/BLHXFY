
import getSkillData from '../store/skill-job'
import isObject from 'lodash/isObject'
import isArray from 'lodash/isArray'
import replaceTurn from '../utils/replaceTurn'
import getNpcSkillData, { skillKeys, getLocalSkillData, getCommSkillMap } from '../store/skill-npc'
import { getPlusStr } from '../utils/'

const skillTemp = new Map()
const posMap = new Map()

export default async function battle(data, mode) {
  let ability
  let scenario
  let spms
  if (mode === 'result') {
    if (isObject(data.status)) {
      ability = data.status.ability
      spms = data.status.skip_special_motion_setting
    }
    if (isObject(data.scenario)) scenario = data.scenario
  } else {
    ability = data.ability
    spms = data.skip_special_motion_setting
    data.temporary_potion_all_name = '群体回复药水'
    data.temporary_potion_one_name = '治疗药水'
  }
  if (isArray(spms)) {
    spms.forEach(item => {
      posMap.set(item.pos, item.setting_id)
    })
  }
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
              }
              skill['duration-type'] = replaceTurn(skill['duration-type'])
            }
          }
        } else if (item.mode === 'npc') {
          const npcId = posMap.get(item.pos)
          const state = await getNpcSkillData(npcId)
          const skillData = state.skillMap.get(npcId)
          if (skillData && isObject(item.list)) {
            let index = 0
            for (let key in item.list) {
              index++
              let arr = item.list[key]
              let skill = arr[0]
              if (skill && skill['ability-name']) {
                const name = skill['ability-name']
                if (skillData[`skill-${name}`]) {
                  const trans = skillData[`skill-${name}`]
                  if (trans) {
                    if (!skillTemp.has(name)) skillTemp.set(name, trans)
                    skill['ability-name'] = trans.name
                    skill['text-data'] = trans.detail
                  }
                } else {
                  const [plus1, plus2] = getPlusStr(name)
                  let trans = skillData[`skill-${index}${plus2}`]
                  if (!trans) trans = skillData[`skill-${index}`]
                  if (trans) {
                    if (!skillTemp.has(name)) skillTemp.set(name, trans)
                    skill['ability-name'] = `${trans.name}${plus1}`
                    skill['text-data'] = trans.detail
                  }
                  skill['duration-type'] = replaceTurn(skill['duration-type'])
                }
              }
            }
          }
        }
      }
    }
  }
  if (scenario) {
    for (let scKey in scenario) {
      let item = scenario[scKey]
      if (item) {
        if (item.cmd === 'ability' && item.name) {
          const trans = skillTemp.get(item.name)
          const [plus1] = getPlusStr(item.name)
          if (trans) {
            item.name = trans.name + plus1
            item.comment = trans.detail
          }
        }
      }
    }
  }
  return data
}
