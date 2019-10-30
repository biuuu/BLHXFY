import fetchData from '../fetch'
import parseCsv from '../utils/parseCsv'
import { getLocalData, setLocalData } from './local-data'
import filter from '../utils/XSSFilter'
import { trim } from '../utils/'

const arcarumMap = new Map()
let loaded = false

const getArcarumData = async () => {
  if (!loaded) {
    let csv = await getLocalData('arcarum')
    if (!csv) {
      csv = await fetchData('/blhxfy/data/arcarum.csv')
      setLocalData('arcarum', csv)
    }
    const list = parseCsv(csv)
    list.forEach(item => {
      const ja = trim(item.ja).replace(/<br>/g, '')
      const zh = filter(item.zh)
      if (ja && zh) {
        arcarumMap.set(ja, zh)
      }
    })
    loaded = true
  }

  return arcarumMap
}

export default getArcarumData
