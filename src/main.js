import injectXHR from './xhr'
import eventMessage from './utils/eventMessage'
import CONFIG from './config'

const main = () => {
  const time = sessionStorage.getItem('blhxfy:startTime') || 0
  const now = Date.now()
  if (now - time < 1000) return
  sessionStorage.setItem('blhxfy:startTime', now)
  eventMessage()
  injectXHR()
}

let win = window.unsafeWindow || window
win.addEventListener('load', () => {
  if (!CONFIG.storyOnly) {
    main()
  } else {
    let started = false
    const start = () => {
      if (!started) {
        started = true
        main()
        observer.disconnect()
      }
    }
    
    const mutationCallback = (mutationsList) => {
      for (let mutation of mutationsList) {
        const type = mutation.type
        const addedNodes = mutation.addedNodes
        if (type === 'childList' && addedNodes.length && addedNodes.length < 2) {
          addedNodes.forEach(node => {
            if (node.tagName.toUpperCase() === 'SCRIPT' && node.src.includes('scenario-model')) {
              start()
            }
          })
        }
      }
    }
    
    const obConfig = {
      childList: true
    }
    
    const targetNode = document.head
    const observer = new MutationObserver(mutationCallback)
    observer.observe(targetNode, obConfig)
  }
})