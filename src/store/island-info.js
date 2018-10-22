import fetchData from '../fetch'
import parseCsv from '../utils/parseCsv'

const islandMap = new Map()
let loaded = false

const trim = (str) => {
  if (!str) return ''
  return str.trim()
}

const getIslandData = async () => {
  if (!loaded) {
    const csv = await fetchData('/blhxfy/data/island-info.csv')
    const list = parseCsv(csv)
    list.forEach(item => {
      const id = trim(item.id)
      const name = trim(item.name)
      const detail = trim(item.detail)
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
