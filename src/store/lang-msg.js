import fetchData from '../fetch'
import { getLocalData, setLocalData } from './local-data'
import parseCsv from '../utils/parseCsv'
import filter from '../utils/XSSFilter'
import { trim } from '../utils/'

const langMsgMap = new Map()
let loaded = false

const getLangMsgData = async () => {
  if (!loaded) {
    let langMsg = await getLocalData('langMsg')
    if (!langMsg) {
      langMsg = await fetchData('/blhxfy/data/lang-msg.csv')
      setLocalData('langMsg', langMsg)
    }
    const list = parseCsv(langMsg)
    list.forEach(item => {
      if (trim(item.id)) {
        item.en && langMsgMap.set(`${item.id}${item.en}`, {
          trans: filter(item.trans),
          en: item.en,
          jp: item.jp
        })
        item.jp && langMsgMap.set(`${item.jp}`, {
          trans: filter(item.trans),
          en: item.en,
          jp: item.jp
        })
      }
    })
    loaded = true
  }
  return langMsgMap
}

export default getLangMsgData
