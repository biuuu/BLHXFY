import { transSkill } from "./skill-npc";
import { getCommSkillMap, skillState } from '../store/skill-npc'
import replaceTurn from '../utils/replaceTurn'

const autoTrans = (skill, type) => {
  if (!skill.comment) return
  skill.comment = transSkill(skill.comment, skillState)
  if (type === 'call') {
    if (skill.recast_comment) skill.recast_comment = replaceTurn(skill.recast_comment)
    if (skill.start_recast_comment) skill.start_recast_comment = replaceTurn(skill.start_recast_comment)
  }
}

const summonSkill = async (data) => {
  await getCommSkillMap()
  if (data.skill) {
    autoTrans(data.skill)
  }
  if (data.sub_skill) {
    autoTrans(data.sub_skill)
  }
  if (data.special_skill) {
    autoTrans(data.special_skill, 'call')
  }
  return data
}

export default summonSkill
