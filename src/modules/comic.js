import getComicData from '../store/comic'

const comic = async (data, pathname) => {
  const rgs = pathname.match(/\/comic\/content\/episode\/(\d+)/)
  if (rgs && rgs[1]) {
    let html
    try {
      html = decodeURIComponent(data.data)
    } catch (err) {
      return data
    }

    const id = rgs[1]
    const comicMap = await getComicData()
    const info = comicMap.get(id)
    if (info) {
      if (info.title) {
        html = html.replace(/(<div\s+class=["']*prt-episode-title["']*>)[^<]*(<\/div>)/, `$1${info.title}$2`)
      }
      html = html.replace(/(<img\s+class=["']*img-episode["']* src=["']*)[^\s"'>]+(?=[\s"'>])/, `$1${info.url}`)
      data.data = encodeURIComponent(html)
    }
  }
  return data
}

export default comic
