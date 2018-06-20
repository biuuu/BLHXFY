const { commSkillMap, autoTransCache } = require('../store/skillMap')

const elemtRE = '([光闇水火風土]|light|dark|water|wind|earth|fire)'
const elemtMap = {
  light: '光', '光': '光', 'dark': '暗', '闇': '暗', 'water': '水', '水': '水',
  wind: '风', '風': '风', 'earth': '土', '土': '土', 'fire': '火', '火': '火'
}
const numRE = '(\\d{1,4})'
const percentRE = '(\\d{1,4}%)'

const parseRegExp = (str) => {
  return str.replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)').replace(/\$elemt/g, elemtRE)
    .replace(/\$num/g, numRE)
    .replace(/\$percent/g, percentRE)
}

const transSkill = (comment) => {
  if (autoTransCache.has(comment)) return autoTransCache.get(comment)
  let result = comment
  for (let [key, value] of commSkillMap) {
    if (!key.trim()) continue
    const { trans, type } = value
    if (type === '1') {
      const re = new RegExp(parseRegExp(key), 'gi')
      result = result.replace(re, (...arr) => {
        let _trans = trans
        for (let i = 1; i < arr.length - 2; i++) {
          let eleKey = arr[i].toLowerCase()
          if (elemtMap[eleKey]) {
            _trans = _trans.replace(`$${i}`, elemtMap[eleKey])
          } else {
            _trans = _trans.replace(`$${i}`, arr[i])
          }
        }
        return _trans
      })
    } else if (type === '2') {
      result = result.replace(key, trans)
    } else if (type === '3') {
      result = result.replace(`(${key})`, `(${trans})`)
    }
  }
  autoTransCache.set(comment, result)
  return result
}

module.exports = transSkill
