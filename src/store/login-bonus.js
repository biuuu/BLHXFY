import fetchData from '../fetch'
import parseCsv from '../utils/parseCsv'
import { trim } from '../utils/'
import filter from '../utils/XSSFilter'

const loginBonusMap = new Map()
let loaded = false

const getLoginBonus = async () => {
  if (!loaded) {
    const csv = await fetchData('/blhxfy/data/login-bonus.csv')
    const list = parseCsv(csv)
    list.forEach(item => {
      const text = trim(item.text)
      const trans = filter(item.trans)
      if (text && trans) {
        loginBonusMap.set(text, trans)
      }
    })
    loaded = true
  }

  return loginBonusMap
}

export default getLoginBonus
