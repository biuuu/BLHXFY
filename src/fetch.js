import EventEmitter  from 'events'
import config from './config'

let ee = new EventEmitter()
let lacia

const insertCSS = () => {
  const link = document.createElement('link')
  link.type = 'text/css'
  link.rel = 'stylesheet'
  link.href = `${config.origin}/blhxfy/data/static/style/BLHXFY.css?lacia=${config.hash['BLHXFY.css'] || ''}`
  document.head.appendChild(link)
}

let timeoutStyleInserted = false
const timeoutStyle = () => {
  if (timeoutStyleInserted) return
  timeoutStyleInserted = true
  const style = document.createElement('style')
  style.innerHTML = `
  .wrapper .cnt-global-header .prt-head-current {
    color: #ff6565;
  }
  `
  document.head.appendChild(style)
}

let loadIframe = () => {
  return new Promise((rev, rej) => {
    window.addEventListener('load', () => {
      const iframe = document.createElement('iframe')
      iframe.src = `${config.origin}/blhxfy/lacia.html`
      iframe.style.display = 'none'
      document.body.appendChild(iframe)
      lacia = iframe.contentWindow
    })
    let timer = setTimeout(() => {
      rej(`加载iframe超时`)
    }, config.timeout * 1000)
    ee.once('loaded', () => {
      clearTimeout(timer)
      rev()
    })
  })
}

let iframeLoaded = false
const fetchData = async (pathname) => {
  const url = pathname
  const flag = Math.random()
  try {
    if (!iframeLoaded) {
      loadIframe = loadIframe()
      iframeLoaded = true
    }
    await loadIframe
    lacia.postMessage({
      type: 'fetch',
      url, flag
    }, config.origin)
  } catch (e) {
    console.info(e)
    return ''
  }
  return new Promise((rev, rej) => {
    let timer = setTimeout(() => {
      rej(`加载${pathname}超时`)
      timeoutStyle()
    }, config.timeout * 1000)
    ee.once(`response${flag}`, function (data) {
      clearTimeout(timer)
      if (data.error) {
        rej(data.error)
      } else {
        rev(data.data)
      }
    })
  })
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
  if (true || fetchInfo.result) {
    return new Promise((rev, rej) => {
      fetch(`${config.origin}${pathname}`)
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
  } else {
    return await fetchData(pathname)
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
          // fetchData('/blhxfy/manifest.json').then(data => {
          //   beforeStart(data)
          //   fetchInfo.data = data
          //   rev(data.hash)
          // })
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

const receiveMessage = (event) => {
  if (event.origin !== config.origin) return
  if (event.data && event.data.type) {
    if (event.data.type === 'response') {
      ee.emit(`response${event.data.flag}`, event.data)
    } else if (event.data.type === 'loaded') {
      ee.emit('loaded')
    }
  }
}


window.addEventListener("message", receiveMessage, false)

export default fetchWithHash
export { getHash, insertCSS, fetchInfo }
