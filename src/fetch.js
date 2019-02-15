import EventEmitter  from 'events'
import config from './config'
import DOMPurify from 'dompurify'
import isString from 'lodash/isString'

const { origin } = config
let ee = new EventEmitter()
let lecia

const insertCSS = (name) => {

  const link = document.createElement('link')
  link.type = 'text/css'
  link.rel = 'stylesheet'
  link.href = `${origin}/blhxfy/data/static/style/${name}.css?lecia=${config.hash || config.localHash}`
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

const load = new Promise((rev, rej) => {
  let timer
  window.addEventListener('load', () => {
    const iframe = document.createElement('iframe')
    iframe.src = `${origin}/blhxfy/lecia.html`
    iframe.style.display = 'none'
    document.body.appendChild(iframe)
    lecia = iframe.contentWindow
    timer = setTimeout(() => {
      rej('加载lecia.html超时')
      timeoutStyle()
    }, config.timeout * 1000)
  })
  ee.once('loaded', () => {
    clearTimeout(timer)
    rev()
  })
})

const fetchData = async (pathname) => {
  await load
  const url = pathname
  const flag = Math.random()
  lecia.postMessage({
    type: 'fetch',
    url, flag
  }, origin)
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

const getHash = fetchData('/blhxfy/manifest.json')

getHash.then(data => {
    config.newVersion = data.version
    return data.hash
  }).then(hash => {
    config.hash = hash
    insertCSS('BLHXFY')
    return hash
  })

const fetchWithHash = async (pathname) => {
  const hash = await getHash
  const data = await fetchData(`${pathname}?lecia=${hash}`)
  return data
}

const receiveMessage = (event) => {
  if (event.origin !== origin) return
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
export { getHash, insertCSS }
