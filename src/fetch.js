import EventEmitter  from 'events'
import config from './config'
import DOMPurify from 'dompurify'
import isString from 'lodash/isString'

const { origin } = config
let ee = new EventEmitter()
let lecia

window.addEventListener('load', () => {
  const iframe = document.createElement('iframe')
  iframe.src = `${origin}/blhxfy/lecia.html`
  iframe.style.display = 'none'
  document.body.appendChild(iframe)
  lecia = iframe.contentWindow
})

const insertCSS = (hash) => {
  const link = document.createElement('link')
  link.type = 'text/css'
  link.rel = 'stylesheet'
  link.href = `${origin}/blhxfy/data/static/style/BLHXFY.css?lecia=${hash}`
  document.head.appendChild(link)
}

const load = new Promise(rev => {
  ee.once('loaded', rev)
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
    ee.once(`response${flag}`, function (data) {
      if (data.error) {
        rej(data.error)
      } else {
        rev(data.data)
      }
    })
  })
}

const getHash = fetchData('/blhxfy/manifest.json').then(data => data.hash)

getHash.then(hash => {
  config.hash = hash
  insertCSS(hash)
  return hash
})

const fetchWithHash = async (pathname) => {
  const hash = await getHash
  const data = await fetchData(`${pathname}?lecia=${hash}`)
  if (isString(data)) {
    return DOMPurify.sanitize(data)
  }
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
export { getHash }
