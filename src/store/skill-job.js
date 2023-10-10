import fetchData from '../fetch'
import parseCsv from '../utils/parseCsv'
import { getLocalData, setLocalData } from './local-data'
import filter from '../utils/XSSFilter'
import { trim } from '../utils/'

const skillMap = new Map()
let loaded = false

const getSkillData = async (id) => {
  if (!loaded) {
    let csv = await getLocalData('job-skill')
    if (!csv) {
      csv = await fetchData('/blhxfy/data/job-skill.csv')
      setLocalData('job-skill', csv)
    }
    const list = parseCsv(csv)
    list.forEach(item => {
      if (item && item.id) {
        const _id = trim(item.id) | 0
        const _en = trim(item.en)
        const _ja = trim(item.ja)
        if (_id) {
          const value = {
            name: filter(item.name),
            detail: filter(item.detail)
          }
          skillMap.set(_id, value)
          if (_ja) skillMap.set(_ja, value)
          if (_en) skillMap.set(_en, value)
        }
      }
    })
    loaded = true
  }

  const trans = skillMap.get(id)
  return trans
}

export default getSkillData
