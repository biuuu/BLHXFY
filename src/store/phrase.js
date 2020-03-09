import fetchData from '../fetch'
import { getLocalData, setLocalData } from './local-data'
import parseCsv from '../utils/parseCsv'
import { trim } from '../utils'
import filter from '../utils/XSSFilter'

const phraseMap = new Map()
let loaded = false

const getPhrase = async () => {
  if (!loaded) {
    let csv = await getLocalData('phrase')
    if (!csv) {
      csv = await fetchData('/blhxfy/data/phrase.csv')
      setLocalData('phrase', csv)
    }
    const list = parseCsv(csv)
    list.forEach(item => {
      const text = item.text
      const trans = filter(item.trans, true)
      if (trim(text) && trans) {
        phraseMap.set(text, trans)
      }
    })
    loaded = true
  }

  return phraseMap
}

export default getPhrase
