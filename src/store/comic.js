import fetchData from '../fetch'
import parseCsv from '../utils/parseCsv'
import { trim } from '../utils/'
import filter from '../utils/XSSFilter'

const comicMap = new Map()
let loaded = false

const getComicData = async () => {
  if (!loaded) {
    const csv = await fetchData('/blhxfy/data/comic.csv')
    const list = parseCsv(csv)
    list.forEach(item => {
      const id = trim(item.id)
      const title = filter(trim(item.title))
      const url = filter(trim(item.url))
      if (id && url) {
        comicMap.set(id, { title, url })
      }
    })
    loaded = true
  }

  return comicMap
}

export default getComicData
