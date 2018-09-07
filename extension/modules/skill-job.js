import getSkillData from '../store/skill-job'
import replaceTurn from '../utils/replaceTurn'

const startTrans = async (data) => {
  for (let key in data) {
    if (data[key]) {
      const trans = await getSkillData(data[key].action_id)
      if (trans) {
        data[key].name = trans.name
        data[key].comment = trans.detail
      }
      if (data[key].recast_comment) {
        data[key].recast_comment = replaceTurn(data[key].recast_comment)
      }
      if (data[key].turn_comment) {
        data[key].turn_comment = replaceTurn(data[key].turn_comment)
      }
    }
  }
  return data
}

const replaceSkill = async (data) => {
  if (data.action_ability) {
    data.action_ability = await startTrans(data.action_ability)
  }
  if (data.support_ability) {
    data.support_ability = await startTrans(data.support_ability)
  }
  return data
}

const transSkill = async (data, pathname) => {
  if (/\/party\/job\/\d+\//.test(pathname)) {
    if (data.job) {
      data.job = await replaceSkill(data.job)
    }
  } else if (pathname.includes('/party_ability_subaction/')) {
    if (data.list) {
      data.list = await startTrans(data.list)
    }
  } else if (/\/party\/ability_list\/\d+\//.test(pathname)) {
    data = await replaceSkill(data)
  } else if (/\/party\/job_info\/\d+\//) {
    if (data.after_job_master) {
      data.after_job_master = await replaceSkill(data.after_job_master)
    }
    if (data.before_job_info) {
      data.before_job_info = await replaceSkill(data.before_job_info)
    }
  }
  return data
}

export default transSkill
