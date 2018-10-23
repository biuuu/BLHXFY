import fetchData from '../fetch'
import parseCsv from '../utils/parseCsv'

const townMap = new Map()
let loaded = false

const trim = (str) => {
  if (!str) return ''
  return str.trim()
}

const getTownData = async () => {
  if (!loaded) {
    const csv = await fetchData('/blhxfy/data/town-info.csv')
    const list = parseCsv(csv)
    list.forEach(item => {
      const id = trim(item.id)
      const name = trim(item.name)
      const detail = trim(item.detail)
      const vyrn = trim(item.vyrn)
      if (id && name) {
        townMap.set(id, { name, detail, vyrn })
      }
    })
    loaded = true
  }

  return townMap
}

export default getTownData
