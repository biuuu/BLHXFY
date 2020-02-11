import injectXHR from './xhr'
import eventMessage from './utils/eventMessage'

const main = () => {
  const time = sessionStorage.getItem('blhxfy:startTime') || 0
  const now = Date.now()
  if (now - time < 1000) return
  sessionStorage.setItem('blhxfy:startTime', now)
  eventMessage()
  injectXHR()
}

let win = unsafeWindow || window
win.addEventListener('load', function () {
  let originDefine = win.define
  let newDefine = function () {
    let list =  arguments[0]
    if (Array.isArray(list) && list.includes('model/quest/scenario-model')) {
      win.define = originDefine
      main()
    }
    originDefine.apply(this, arguments)
  }
  win.define = newDefine
})