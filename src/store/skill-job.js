import fetchData from '../fetch'
import parseCsv from '../utils/parseCsv'
import filter from '../utils/XSSFilter'
import { trim } from '../utils/'

const skillMap = new Map()
let loaded = false

const getSkillData = async (id) => {
  if (!loaded) {
    const csv = await fetchData('/blhxfy/data/job-skill.csv')
    const list = parseCsv(csv)
    list.forEach(item => {
      if (item && item.id) {
        const _id = trim(item.id)
        if (_id) skillMap.set(_id, {
          name: filter(trim(item.name)),
          detail: filter(trim(item.detail))
        })
      }
    })
    loaded = true
  }

  const trans = skillMap.get(id)
  return trans
}

export default getSkillData
