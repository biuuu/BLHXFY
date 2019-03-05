import fetchData from '../fetch'
import parseCsv from '../utils/parseCsv'
import { trim } from '../utils/'
import filter from '../utils/XSSFilter'
import { getLocalData, setLocalData } from './local-data'

const townMap = new Map()
let loaded = false

const getTownData = async () => {
  if (!loaded) {
    let csv = await getLocalData('town-info')
    if (!csv) {
      csv = await fetchData('/blhxfy/data/town-info.csv')
      setLocalData('town-info', csv)
    }
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
