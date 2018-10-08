import fetchData from '../fetch'
import parseCsv from '../utils/parseCsv'
import { trim } from '../utils/'
import { getLocalData, setLocalData } from './local-data'

const buffMap = {
  buff: new Map(),
  debuff: new Map()
}
let loaded = false

const getData = async (type) => {
  let csv = getLocalData(type)
  if (!csv) {
    csv = await fetchData(`/blhxfy/data/${type}.csv`)
    setLocalData(type, csv)
  }
  const list = parseCsv(csv)
  list.forEach(item => {
    const detail = trim(item.detail)
    const trans = trim(item.trans)
    if (detail && trans) {
      buffMap[type].set(detail, trans)
    }
  })
}

const getBuffData = async (type) => {
  if (!loaded) {
    await getData('buff')
    await getData('debuff')
    loaded = true
  }

  return buffMap[type]
}

export default getBuffData
