import fetchData from '../fetch'
import parseCsv from '../utils/parseCsv'
import filter from '../utils/XSSFilter'
import { trim } from '../utils/'

const islandMap = new Map()
let loaded = false

const getIslandData = async () => {
  if (!loaded) {
    const csv = await fetchData('/blhxfy/data/island-info.csv')
    const list = parseCsv(csv)
    list.forEach(item => {
      const id = trim(item.id)
      const name = filter(item.name)
      const detail = filter(item.detail)
      if (id && name) {
        islandMap.set(id, { name, detail })
        if (id === 'skydom') {
          islandMap.set(name, detail)
        }
      }
    })
    loaded = true
  }

  return islandMap
}

export default getIslandData
