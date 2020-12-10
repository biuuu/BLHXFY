import fetchData from '../fetch'
import parseCsv from '../utils/parseCsv'
import filter from '../utils/XSSFilter'

const skinMap = new Map()
let loaded = false

const getStoryNpc = async () => {
  if (!loaded) {
    const csv = await fetchData('/blhxfy/data/story-npc.csv')
    const list = parseCsv(csv)
    list.forEach(item => {
      const comment = filter(item.comment)
      const id = item.id
      if (id && comment) {
        skinMap.set(id, comment)
      }
    })
    loaded = true
  }

  return skinMap
}

export default getStoryNpc
