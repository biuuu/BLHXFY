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

main()
