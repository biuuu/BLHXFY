import getComicData from '../store/comic'

const insertTemplate = (html) => {
  return html.replace('<div class="prt-episode-thumbnail">', `<% if (n.trans) { %><div class="comic-transtag-blhxfy">🌼</div><% } %><div class="prt-episode-thumbnail">`)
}

const comic = async (data, pathname, type = 'default') => {
  if (type === 'template') {
    let html
    try {
      html = decodeURIComponent(data.data)
    } catch (err) {
      return data
    }
    html = insertTemplate(html)
    data.data = encodeURIComponent(html)
  } else if (type === 'data') {
    const comicMap = await getComicData()
    if (data.list) {
      for (let key in data.list) {
        const item = data.list[key]
        let id = parseInt(item.id)
        if (comicMap.has(id)) {
          item.trans = true
        }
      }
    }
  } else {
    const rgs = pathname.match(/\/comic\/content\/episode\/(\d+)/)
    if (rgs && rgs[1]) {
      const id = parseInt(rgs[1])
      const comicMap = await getComicData()
      const info = comicMap.get(id)
      if (info) {
        let html
        try {
          html = decodeURIComponent(data.data)
        } catch (err) {
          return data
        }
        if (info.title) {
          html = html.replace(/(<div\s+class=["']*prt-episode-title["']*>)[^<]*(<\/div>)/, `$1${info.title}$2`)
        }
        html = html.replace(/(<img\s+class=["']*img-episode["']* src=["']*)[^\s"'>]+(?=[\s"'>])/, `$1${info.url}`)
        data.data = encodeURIComponent(html)
      }
    }
  }

  return data
}

const transComicT = async (data, pathname) => {
  return await comic(data, pathname, 'template')
}

const transComicD = async (data, pathname) => {
  return await comic(data, pathname, 'data')
}

export { transComicT, transComicD }
export default comic
