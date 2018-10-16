import fetchData from '../fetch'
import parseCsv from '../utils/parseCsv'
import { getLocalData, setLocalData } from './local-data'

const chatMap = new Map()
const nChatMap = new Map()
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
      const text = trim(item.text)
      const trans = trim(item.trans)
      if (id && trans) {
        if (/\d+-n/.test(id)) {
          const rgs = id.match(/(\d+)-n/)
          const _id = rgs[1]
          nChatMap.set(_id, {
            text, trans
          })
        } else {
          chatMap.set(id, trans)
        }
      }
    })
    loaded = true
  }

  return { chatMap, nChatMap }
}

export default getChatData
