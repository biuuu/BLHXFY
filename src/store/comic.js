import fetchData from '../fetch'
import parseCsv from '../utils/parseCsv'
import { trim } from '../utils/'
import filter from '../utils/XSSFilter'

const comicMap = new Map()
let loaded = false

const getComicData = async () => {
  if (!loaded) {
    const res = await fetch('https://gbf.danmu9.com/4ko.json')
    const list = await res.json()
    list.forEach(arr => {
      const id = arr[0]
      const title = filter(arr[1])
      const url = `https://gbf.danmu9.com/4ko/${id}.jpg`
      if (id) {
        comicMap.set(id, { title, url })
      }
    })
    loaded = true
  }

  return comicMap
}

export default getComicData
