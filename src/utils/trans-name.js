import { trim } from './index'

const ignoreList = ['null', '???', '？？？']
const sepList = ['・', '&', ' and ', '＆']

const getTrans = (text, maps) => {
  for (let map of maps) {
    if (map.has(text)) {
      return map.get(text)
    }
  }
  return false
}

const transName = (text, maps) => {
  const name = trim(text)
  if (ignoreList.includes(name)) return text
  let trans = getTrans(text, maps)

  if (/.+?\s?[\?？0-9０-９]{1,2}$/.test(name)) {
    const rs = name.match(/(.+?)\s?([\?？0-9０-９]{1,2})$/)
    const transTemp = getTrans(rs[1], maps)
    if (transTemp) trans = `${transTemp}${rs[2]}`
  } else if (/'s\sVoice$/.test(name)) {
    let nameTemp = name.slice(0, name.length - 8)
    const transTemp = getTrans(nameTemp, maps)
    if (transTemp) trans = `${transTemp}的声音`
  } else if (/の声$/.test(name)) {
    let nameTemp = name.slice(0, name.length - 2)
    const transTemp = getTrans(nameTemp, maps)
    if (transTemp) trans = `${transTemp}的声音`
  } else if (!trans) {
    sepList.forEach(sep => {
      if (new RegExp(sep).test(name)) {
        const arr = name.split(sep)
        trans = arr.map(nm => {
          const transTemp = getTrans(nm, maps)
          return transTemp || nm
        }).join('・')
      }
    })
  }

  return trans || text
}

export default transName