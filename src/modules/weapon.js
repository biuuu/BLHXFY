import { transSkill } from "./skill-npc";
import { getCommSkillMap, skillState } from '../store/skill-npc'

const autoTrans = (skill) => {
  if (!skill.comment) return
  skill.comment = transSkill(skill.comment, skillState)
}

const weaponSkill = async (data) => {
  await getCommSkillMap()
  if (data.skill1) {
    autoTrans(data.skill1)
  }
  if (data.skill2) {
    autoTrans(data.skill2)
  }
  if (data.special_skill) {
    autoTrans(data.special_skill)
  }
  return data
}

export default weaponSkill
