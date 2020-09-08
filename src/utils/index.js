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

const removeNotMatchedHtmlTag = (str) => {
  if (/<\/?(span|div)[^>]*>/.test(str)) {
    return str.replace(/<\/?(span|div)[^>]*>/g, '')
  }
  return str
}

const removeNormalHtmlTag = (str, count = 0, wrap) => {
  count++
  if (!/<(\w{1,7})[^>]*>/.test(str) || count > 2) return str
  let _str
  if (wrap) {
    _str = str.replace(/<br\s?\/?>/ig, '\n').replace(/\n+/g, '\n')
  } else {
    _str = str.replace(/<br\s?\/?>/ig, '')
  }
  _str = _str.replace(/<(\w{1,7})[^>]*>([^<]*)<\/\1>/g, '$2')
  return removeNormalHtmlTag(_str, count, wrap)
}

const removeHtmlTag = (str, count = 0, wrap) => {
  const _str = removeNormalHtmlTag(str, count, wrap)
  return removeNotMatchedHtmlTag(_str)
}


const isFullTag = (text) => {
  let _text = trim(text.replace(/<br\s?\/?>/ig, ''))
  let isFull = true
  let type = ''
  while (_text && isFull) {
    let _type = ''
    if (/^<span[^>]*>.+<\/span>/.test(_text)) {
      _type = _text.match(/^(<span[^>]*>).+<\/span>/)[1]
      _text = trim(_text.replace(/^<span[^>]*>.+<\/span>/, ''))
      if (!type) type = _type
      if (type !== _type) isFull = false
    } else {
      isFull = false
    }
  }
  return isFull
}

const simpleHtml = (text) => {
  let _text = text.replace(/<br\s?\/?>/ig, '\\n')
  if (!isFullTag(text)) return _text
  _text = _text.replace(/<(\w{1,7})[^>]*>([^<]*)<\/\1>/g, '$2')
  return _text
}

const restoreHtml = (text, origin) => {
  let html = text.replace(/\\n/g, '<br>')
  if (!isFullTag(text) && isFullTag(origin)) {
    let startText = origin.match(/(^<\w+[^>]*>)/)[1]
    let tagName = startText.match(/<(\w+)[^>]*>/)[1]
    html = html.split('<br>').map(txt => {
      return `${startText}${txt}</${tagName}>`
    }).join('<br>')
  }
  return html
}

const replaceWords = (str, map, lang = 'en') => {
  if (!str) return str
  let _str = str
  for (let [key, val] of map) {
    if (!key || key.length < 2) continue
    const expr = key.replace(/\./g, '\\.').replace(/\*/g, '\\*')
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

const getPlusStr = (str) => {
  let plusStr = ''
  let plusStr2 = ''
  let _str = str
  while (_str.endsWith('+') || _str.endsWith('＋')) {
    plusStr += '＋'
    plusStr2 += '+'
    _str = _str.slice(0, _str.length - 1)
  }
  return [plusStr, plusStr2, _str]
}

const race = (func, time = 500) => {
  return function (...args) {
    const promise1 = func(...args)
    const promise2 = new Promise(rev => {
      setTimeout(() => {
        rev(args[0])
      }, time)
    })
    return Promise.race([promise1, promise2])
  }
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
  removeHtmlTag,
  getPlusStr,
  race,
  simpleHtml,
  restoreHtml
}
