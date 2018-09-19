import fetchData from '../fetch'
import parseCsv from '../utils/parseCsv'

const voiceMap = new Map()
let loaded = false

const trim = (str) => {
  if (!str) return ''
  return str.trim()
}

const getTownData = async () => {
  if (!loaded) {
    const csv = await fetchData('/blhxfy/data/voice-mypage.csv')
    const list = parseCsv(csv)
    list.forEach(item => {
      const path = trim(item.path)
      const jp = trim(item.jp)
      const trans = trim(item.trans)
      const duration = trim(item.duration) || 10
      if (path && trans) {
        voiceMap.set(path, { trans, jp, duration })
      }
    })
    loaded = true
  }

  return voiceMap
}

export default getTownData
