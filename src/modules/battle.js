
import getSkillData from '../store/skill-job'
import isObject from 'lodash/isObject'
import replaceTurn from '../utils/replaceTurn'

export default async function battle(data) {
  if (isObject(data.ability)) {
    for (let abKey in data.ability) {
      let item = data.ability[abKey]
      if (item && item.mode === 'player' && isObject(item.list)) {
        for (let key in item.list) {
          let arr = item.list[key]
          let skill = arr[0]
          if (skill && skill['ability-id']) {
            const trans = await getSkillData(skill['ability-id'])
            if (trans) {
              skill['ability-name'] = trans.name
              skill['text-data'] = trans.detail
            }
            skill['duration-type'] = replaceTurn(skill['duration-type'])
          }
        }
      }
    }
  }
  return data
}
