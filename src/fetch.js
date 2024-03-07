import config from './config'

const insertCSS = () => {
  const link = document.createElement('link')
  link.type = 'text/css'
  link.rel = 'stylesheet'
  link.href = `${config.origin}/blhxfy/data/static/style/BLHXFY.css?lacia=${config.hash['BLHXFY.css'] || ''}`
  document.head.appendChild(link)
}

let fetchInfo = {
  status: 'init',
  result: false,
  data: null
}

const saveManifest = async () => {
  const t = Math.floor(Date.now() / 1000 / 60 / 60 / 6)
  const res = await fetch(`${config.origin}/blhxfy/manifest.json?t=${t}`)
  const data = await res.json()
  data.time = Date.now()
  localStorage.setItem('blhxfy:manifest', JSON.stringify(data))
  return data
}

const getManifest = async () => {
  let data
  try {
    let str = localStorage.getItem('blhxfy:manifest')
    if (str) data = JSON.parse(str)
    if (Date.now() - data.time > config.cacheTime * 60 * 1000) data = false
  } catch (e) {}
  if (!data) {
    data = await saveManifest()
  } else {
    setTimeout(saveManifest, 5 * 1000)
  }
  return data
}

const tryFetch = async () => {
  if (window.fetch) {
    // if (sessionStorage.getItem('blhxfy:cors') === 'disabled') {
    //   fetchInfo.status = 'finished'
    //   return
    // }
    try {
      const data = await getManifest()
      fetchInfo.data = data
      fetchInfo.result = true
      sessionStorage.setItem('blhxfy:cors', 'enabled')
    } catch (e) {
      sessionStorage.setItem('blhxfy:cors', 'disabled')
    }
  }
  fetchInfo.status = 'finished'
}

const request = async (pathname) => {
  if (fetchInfo.result) {
    return new Promise((rev, rej) => {
      const url = /^https?:\/\//.test(pathname) ? pathname :`${config.origin}${pathname}`
      fetch(url)
      .then(res => {
        if (!res.ok) {
          rej(`${res.status} ${res.url}`)
          return ''
        }
        const type = res.headers.get('content-type')
        if (type.includes('json')) {
          return res.json()
        }
        return res.text()
      }).then(rev).catch(rej)
    })
  }
}

let getHashPrms
let getHash = () => {
  if (getHashPrms) return getHashPrms
  return getHashPrms = new Promise((rev, rej) => {
    if (fetchInfo.status !== 'finished') {
      tryFetch().then(() => {
        const beforeStart = (data) => {
          config.newVersion = data.version
          config.hash = data.hashes
          insertCSS('BLHXFY')
        }
        if (fetchInfo.result) {
          beforeStart(fetchInfo.data)
          rev(fetchInfo.data.hashes)
        } else {
          rej('加载manifest.json失败')
        }
      }).catch(rej)
    } else {
      rev(fetchInfo.data.hashes)
    }
  })
}

const fetchWithHash = async (pathname, hash) => {
  if (!hash) {
    const hashes = await getHash()
    const key = pathname.replace('/blhxfy/data/', '')
    hash = hashes[key]
  }
  const data = await request(`${pathname}${hash ? `?lacia=${hash}` : ''}`)
  return data
}


export default fetchWithHash
export { getHash, insertCSS, fetchInfo }
