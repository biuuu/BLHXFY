import fetchData from '../fetch'
import parseCsv from '../utils/parseCsv'
import sortKeywords from '../utils/sortKeywords'

const htmlMap = new Map()
let loaded = false

const trim = (str) => {
  if (!str) return ''
  return str.trim()
}

const getCommHtmlData = async () => {
  if (!loaded) {
    const csv = await fetchData('/blhxfy/data/common-html.csv')
    const list = parseCsv(csv)
    sortKeywords(list, 'html').forEach(item => {
      const pathname = trim(item.path)
      const html = trim(item.text)
      const trans = trim(item.trans)
      const times = (item.count | 0) || 1
      if (pathname && text && trans) {
        if (htmlMap.has(pathname)) {
          htmlMap.get(pathname).push({ text, trans, times })
        } else {
          htmlMap.set(pathname, [{ text, trans, times }])
        }
      }
    })
    loaded = true
  }

  return htmlMap
}

export default getCommHtmlData
