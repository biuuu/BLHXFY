import fetchData from '../fetch'
import parseCsv from '../utils/parseCsv'
import { trim } from '../utils'
import filter from '../utils/XSSFilter'

const phraseMap = new Map()
let loaded = false

const getPhrase = async () => {
  if (!loaded) {
    const csv = await fetchData('/blhxfy/data/phrase.csv')
    const list = parseCsv(csv)
    list.forEach(item => {
      const text = trim(item.text)
      const trans = filter(item.trans)
      if (text && trans) {
        phraseMap.set(text, trans)
      }
    })
    loaded = true
  }

  return phraseMap
}

export default getPhrase
