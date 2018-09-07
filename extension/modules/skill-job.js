import getSkillData from '../store/skill-job'

const transSkill = async (data) => {
  if (!data.list) return data
  const skillMap = await getSkillData()
  data.list[0].name = '测试'
  data.list[0].comment = '测试'
  return data
}

export default transSkill
