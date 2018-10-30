import fetchData from '../fetch'
import parseCsv from '../utils/parseCsv'
import { trim } from '../utils/'
import filter from '../utils/XSSFilter'

const townMap = new Map()
let loaded = false

const getTownData = async () => {
  if (!loaded) {
    const csv = await fetchData('/blhxfy/data/town-info.csv')
    const list = parseCsv(csv)
    list.forEach(item => {
      const id = trim(item.id)
      const name = filter(trim(item.name))
      const detail = filter(trim(item.detail))
      const vyrn = filter(trim(item.vyrn))
      if (id && name) {
        townMap.set(id, { name, detail, vyrn })
      }
    })
    loaded = true
  }

  return townMap
}

export default getTownData
