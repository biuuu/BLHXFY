import fetchData from '../fetch'
import parseCsv from '../utils/parseCsv'
import sortKeywords from '../utils/sortKeywords'
import { getLocalData, setLocalData } from './local-data'
import filter from '../utils/XSSFilter'
import { trim } from '../utils/'

const htmlMap = new Map()
let loaded = false

const getCommHtmlData = async () => {
  if (!loaded) {
    let csv = await getLocalData('common-html')
    if (!csv) {
      csv = await fetchData('/blhxfy/data/common-html.csv')
      setLocalData('common-html', csv)
    }
    const list = parseCsv(csv)
    const tempMap = new Map()
    sortKeywords(list, 'text').forEach((item, index) => {
      const pathname = trim(item.path)
      const text = trim(item.text)
      const trans = filter(item.trans)
      const times = (item.count | 0) || 1
      if (pathname && text && trans) {
        if (tempMap.has(pathname)) {
          tempMap.get(pathname).push({ text, trans, times, index })
        } else {
          tempMap.set(pathname, [{ text, trans, times, index }])
        }
      }
    })
    sortKeywords(Array.from(tempMap.keys())).forEach(key => {
      htmlMap.set(key, tempMap.get(key))
    })
    loaded = true
  }

  return htmlMap
}

export default getCommHtmlData
