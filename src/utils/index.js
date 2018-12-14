import DOMPurify from 'dompurify'

const trim = (str) => {
  if (!str) return ''
  return str.trim()
}

const tryDownload = (content, filename) => {
  const eleLink = document.createElement('a')
  eleLink.download = filename
  eleLink.style.display = 'none'
  const blob = new Blob([content], { type: 'text/csv' })
  eleLink.href = URL.createObjectURL(blob)
  document.body.appendChild(eleLink)
  eleLink.click()
  document.body.removeChild(eleLink)
}

const removeTag = (html) => {
  if (html.startsWith('<')) {
    return html.replace(/^<[^>]+>([^<]*)<\/[^>]+>/, '$1')
  }
  return html
}

const removeHtmlTag = (str, count = 0) => {
  count++
  if (!/<(\w{1,7})[^>]*>/.test(str) || count > 2) return str
  const _str = str.replace(/<br\s?\/?>/g, '').replace(/<(\w{1,7})[^>]*>([^<]*)<\/\1>/g, '$2')
  return removeHtmlTag(_str, count)
}

const replaceWords = (str, map, lang = 'en') => {
  if (!str) return str
  let _str = str
  for (let [key, val] of map) {
    if (!key || key.length < 2) continue
    const expr = key.replace(/\?/g, '\\?').replace(/\./g, '\\.').replace(/\*/g, '\\*').replace(/\+/g, '\\+')
    const reStr = lang === 'en' ? `\\b${expr}\\b` : `${expr}`
    if (typeof val === 'string') {
      _str = _str.replace(new RegExp(reStr, 'g'), val)
    } else if (val && val.trans && !val.noun) {
      if (val.ignoreCase) {
        _str = _str.replace(new RegExp(reStr, 'gi'), val.trans)
      } else {
        _str = _str.replace(new RegExp(reStr, 'g'), val.trans)
      }
    }
  }
  return _str
}

const getPreview = () => {
  const str = sessionStorage.getItem('blhxfy:preview')
  let data = []
  if (str) {
    try {
      data = JSON.parse(str)
    } catch (e) {
      console.error(e)
    }
  }
  return data
}

const getPreviewCsv = (name) => {
  const data = getPreview()
  let csv = ''
  for (let item of data) {
    if (item.name === name) {
      csv =  DOMPurify.sanitize(item.csv)
    }
  }
  return csv
}

const splitSingleLineSkill = (csv) => {
  return csv.replace(/\s(skill|special|npc|support|intro|,|active)/g, '\n$1')
}

const isDomain = (str) => {
  if (!/^https?:\/\//.test(str)) return false
  if (/\s/.test(str.trim())) return false
  return true
}

export {
  trim,
  tryDownload,
  replaceWords,
  getPreview,
  getPreviewCsv,
  splitSingleLineSkill,
  isDomain,
  removeTag,
  removeHtmlTag
}
