import fetchData from '../fetch'
import parseCsv from '../utils/parseCsv'

const skillMap = new Map()
let loaded = false

const getSkillData = async (id) => {
  if (!loaded) {
    const csv = await fetchData('/blhxfy/data/job-skill.csv')
    const list = parseCsv(csv)
    list.forEach(item => {
      if (item && item.id) {
        const _id = item.id.trim()
        if (_id) skillMap.set(_id, {
          name: item.name.trim(),
          detail: item.detail.trim()
        })
      }
    })
  }

  const trans = skillMap.get(id)
  return trans
}

export default getSkillData
