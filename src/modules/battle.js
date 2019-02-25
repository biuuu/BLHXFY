
import getSkillData from '../store/skill-job'
import isObject from 'lodash/isObject'
import isArray from 'lodash/isArray'
import replaceTurn from '../utils/replaceTurn'
import getNpcSkillData, { skillKeys, getLocalSkillData, getCommSkillMap } from '../store/skill-npc'

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
            if (skill && skill['ability-id']) {
              const name = skill['ability-name']
              const trans = await getSkillData(name)
              if (trans) {
                if (!skillTemp.has(name)) skillTemp.set(name, trans)
                name = trans.name
                skill['text-data'] = trans.detail
              }
              skill['duration-type'] = replaceTurn(skill['duration-type'])
            }
          }
        } else if (item.mode === 'npc') {
          const npcId = spms.get(item.pos)
          const state = await getNpcSkillData(npcId)
          const skillDate = state.skillMap.get(npcId)
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
          if (trans) {
            item.name= trans.name
            item.comment = trans.detail
          }
        }
      }
    }
  }
  return data
}
