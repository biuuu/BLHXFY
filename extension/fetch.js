import EventEmitter  from 'events'

var ee = new EventEmitter()
const origin = 'https://blhx.danmu9.com'

const iframe = document.createElement('iframe')
iframe.src = `${origin}/blhxfy/lecia.html`
iframe.style.display = 'none'
document.body.appendChild(iframe)

const link = document.createElement('link')
link.type = 'text/css'
link.rel = 'stylesheet'
link.href = `${origin}/blhxfy/data/static/style/BLHXFY.css`
document.head.appendChild(link)

const lecia = iframe.contentWindow

const load = new Promise(rev => {
  ee.once('loaded', rev)
})

const fetch = async (pathname) => {
  await load
  const url = pathname
  const flag = Math.random()
  lecia.postMessage({
    type: 'fetch',
    url, flag
  }, origin)
  return new Promise((rev, rej) => {
    ee.once(`response${flag}`, function (data) {
      if (data.err) {
        rej(err)
      } else {
        rev(data)
      }
    })
  })
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

export default fetch
