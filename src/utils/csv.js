const strTemplate = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
const len = strTemplate.length
const randomStr = (count) => {
  let result = ''
  for (let i = 0; i < count; i++) {
    const index = Math.floor(Math.random() * len)
    result +=strTemplate[index]
  }
  return result
}

const parse = (csv) => {
  if (typeof csv !== 'string') {
    throw new TypeError('参数必需是String')
  }
  const DB_QUOTE = randomStr(5)
  const QUOTE_KEY = randomStr(5)
  const quoteMap = new Map()
  const len = csv.length
  const result = []
  let needSlice = false
  csv = csv.replace(/^[\r\n\s\ufeff]*/, '')
  csv = csv.replace(/""/g, DB_QUOTE)
  if (/"\s*$/.test(csv)) {
    csv += '\n'
    needSlice = true
  }
  let key = randomStr(10)
  csv = csv.replace(/([,\n])\s*"([^"]+)"\s*([\r\n,])/g, (match, p1, p3, p2, offset) => {
    const val = p3.replace(new RegExp(DB_QUOTE, 'g'), '"')
    quoteMap.set(`${QUOTE_KEY}-${offset}`, val)
    return `${p1}${QUOTE_KEY}-${offset}${p2}`
  })
  if (needSlice) csv = csv.slice(0, len)
  const arr = csv.split(/\r?\n/)
  if (!arr.length) return result
  const keys = arr[0].trim().split(',')
  if (!keys.length) return result
  arr.shift()
  for (let i = 0; i < arr.length; i++) {
    const line = arr[i]
    const values = line.split(',')
    const data = {}
    for (let j = 0; j < keys.length; j++) {
      const key = keys[j]
      let val = values[j] || ''
      for (let [qKey, qVal] of quoteMap) {
        val = val.replace(qKey, qVal)
      }
      data[key] = val
    }
    result.push(data)
  }
  return result
}

export default parse