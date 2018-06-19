const { commSkillMap } = require('../store/skillMap')

const parseSkill = (str) => {
  const arr = str.split(' / ')
  const result = arr.map(item => {
    const _str = item.trim()
    if (_str) {
      return commSkillMap.get(_str)
    }
  })
  return result.join('/')
}

const parseNote = (str) => {
  let _str = str
  const arr = str.match(/(.*)<(\w+)[^>]+>\((.+)\)<\/\2>(.*)/)
  if (arr) {
    const str1 = parseSkill(arr[1])
    const str2 = parseSkill(arr[3])
    const str3 = parseSkill(arr[4])
    _str = _str.replace(arr[1], str1).replace(arr[3], str2).replace(arr[4], str3)
  }
  _str = parseSkill(_str)
  return _str
}

const parseTag = (html, handler) => {
  const arr = html.match(/^<(\w+)[^>]+>(.+)<\/\1>$/)
  if (arr && arr[2]) {
    const result = parseTag(arr[2], handler)
    return html.replace(arr[2], result)
  }
  return handler(html)
}

const transSkill = (comment) => {
  return parseTag(comment, parseNote)
}

module.exports = transSkill
