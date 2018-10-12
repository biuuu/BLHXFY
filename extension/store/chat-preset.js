import fetchData from '../fetch'
import parseCsv from '../utils/parseCsv'
import { getLocalData, setLocalData } from './local-data'

const chatMap = new Map()
let loaded = false

const trim = (str) => {
  if (!str) return ''
  return str.trim()
}

const getChatData = async () => {
  if (!loaded) {
    let csv = await getLocalData('chat-preset')
    if (!csv) {
      csv = await fetchData('/blhxfy/data/chat-preset.csv')
      setLocalData('chat-preset', csv)
    }
    const list = parseCsv(csv)
    list.forEach(item => {
      const id = trim(item.id)
      const trans = trim(item.trans)
      if (id && trans) {
        chatMap.set(id, trans)
      }
    })
    loaded = true
  }

  return chatMap
}

export default getChatData
