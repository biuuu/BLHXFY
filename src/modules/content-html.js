import getCommHtmlData from '../store/common-html'
import getArchiveData from '../store/archive'
import insertSettingHtml from '../setting/insertHtml'
import CONFIG from '../config'

const replaceHTML = async (html, pathname) => {
  let _html = html
  let theList = []
  const htmlMap = await getCommHtmlData()
  for (let [key, list] of htmlMap.entries()) {
    if (pathname.includes(key)) {
      theList = theList.concat(list)
    }
  }
  theList
  .sort((prev, next) => prev.index - next.index)
  .forEach(item => {
    for (let i = 0; i < item.times; i++) {
      let newHtml = _html.replace(item.text, item.trans)
      if (newHtml !== _html) {
        _html = newHtml
      } else {
        break
      }
    }
  })
  return _html
}

const replaceArchive = async (html) => {
  let _html = html
  const htmlMap = await getArchiveData()
  for (let [text, item] of htmlMap.entries()) {
    for (let i = 0; i < item.times; i++) {
      let newHtml = _html.replace(text, item.trans)
      if (newHtml !== _html) {
        _html = newHtml
      } else {
        break
      }
    }
  }
  return _html
}

let settingHtml = false
const getHtml = async (encodedHtml, pathname) => {
  let html = ''
  try {
    html = decodeURIComponent(encodedHtml)
  } catch (err) {
    return encodedHtml
  }
  if (CONFIG.log) {
    console.log({
      [pathname]: html.trim()
    })
  }
  try {
    if (pathname.includes('/archive/content/library/')) {
      html = await replaceArchive(html)
    } else {
      html = await replaceHTML(html, pathname)
    }
  } catch (err) {
    console.error(err)
  }
  if (!settingHtml && pathname.includes('/setting/content/index/index')) {
    html = insertSettingHtml(html)
    settingHtml = true
  }
  return encodeURIComponent(html)
}

export default async function transHTML(data, pathname) {
  if (data.data) {
    data.data = await getHtml(data.data, pathname)
  }
  if (data.option && data.option.progress) {
    data.option.progress = await getHtml(data.option.progress, pathname)
  }
  if (data.option && data.option.quest) {
    if (data.option.quest.content__index) {
      data.option.quest.content__index = await getHtml(data.option.quest.content__index, pathname)
    }
    if (data.option.quest.content_list) {
      data.option.quest.content_list = await getHtml(data.option.quest.content_list, pathname)
    }
  }
  return data
}
