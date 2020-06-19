import fetchData from '../fetch'
import parseCsv from '../utils/parseCsv'
import filter from '../utils/XSSFilter'

const skinMap = new Map()
let loaded = false

const getSkinData = async () => {
  if (!loaded) {
    const csv = await fetchData('/blhxfy/data/skin.csv')
    const list = parseCsv(csv)
    list.forEach(item => {
      const name = filter(item.name)
      const comment = filter(item.comment)
      const id = item.id
      if (id && comment) {
        skinMap.set(id, { name, comment })
      }
    })
    loaded = true
  }

  return skinMap
}

export default getSkinData
