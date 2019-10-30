import fetchData from '../fetch'
import parseCsv from '../utils/parseCsv'
import sortKeywords from '../utils/sortKeywords'
import filter from '../utils/XSSFilter'
import { trim } from '../utils/'

const htmlMap = new Map()
let loaded = false

const getArchiveData = async () => {
  if (!loaded) {
    const csv = await fetchData('/blhxfy/data/archive.csv')
    const list = parseCsv(csv)
    sortKeywords(list, 'text').forEach(item => {
      const text = trim(item.text)
      const trans = filter(item.trans)
      const times = (item.count | 0) || 1
      if (text && trans) {
        htmlMap.set(text, { trans, times })
      }
    })
    loaded = true
  }

  return htmlMap
}

export default getArchiveData
