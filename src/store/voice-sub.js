import fetchData from '../fetch'
import parseCsv from '../utils/parseCsv'
import { trim } from '../utils/'
import filter from '../utils/XSSFilter'

const voiceMap = new Map()
let loaded = false

const getTownData = async () => {
  if (!loaded) {
    const csv = await fetchData('/blhxfy/data/voice-mypage.csv')
    const list = parseCsv(csv)
    list.forEach(item => {
      const path = trim(item.path)
      const trans = filter(item.trans)
      const duration = trim(item.duration) || 10
      if (path && trans) {
        voiceMap.set(path, { trans, duration })
      }
    })
    loaded = true
  }

  return voiceMap
}

export default getTownData
