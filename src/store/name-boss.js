import fetchData from '../fetch'
import parseCsv from '../utils/parseCsv'
import filter from '../utils/XSSFilter'
import { trim } from '../utils/'
import { getLocalData, setLocalData } from './local-data'

const bossNameMap = new Map()
let loaded = false

const getBossName = async () => {
  if (!loaded) {
    let csv = await getLocalData('battle/boss-name')
    if (!csv) {
      csv = await fetchData('/blhxfy/data/battle/boss-name.csv')
      let csvNpc = await fetchData('/blhxfy/data/npc-name-jp.csv')
      csv = csv.replace(/\r\n/g, '\n')
      csv += csvNpc.replace(/\r\n/g, '\n').replace(/^name,trans/, '')
      setLocalData('battle/boss-name', csv)
    }
    const list = parseCsv(csv)
    list.forEach(item => {
      const name = trim(item.name)
      const trans = filter(item.trans)
      if (name && trans) {
        bossNameMap.set(name, trans)
      }
    })
    loaded = true
  }

  return bossNameMap
}

export default getBossName
