import getCommHtmlData from '../store/common-html'

const replaceHTML = async (html, pathname) => {
  let _html = html
  const htmlMap = await getCommHtmlData()
  for (let [key, list] of htmlMap.entries()) {
    if (pathname.includes(key)) {
      list.forEach(item => {
        for (let i = 0; i < item.times; i++) {
          let newHtml = _html.replace(item.text, item.trans)
          if (newHtml !== _html) {
            _html = newHtml
          } else {
            break
          }
        }
      })
    }
  }
  return _html
}

export default async function transHTML(data, pathname) {
  if (!data.data) return data
  let html
  try {
    html = decodeURIComponent(data.data)
  } catch (err) {
    return data
  }
  console.info(pathname)
  console.log(html)
  html = await replaceHTML(html, pathname)
  data.data = encodeURIComponent(html)
  return data
}
