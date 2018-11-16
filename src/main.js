import injectXHR from './xhr'
import eventMessage from './utils/eventMessage'

const main = () => {
  if (window.blhxfy) return
  eventMessage()
  injectXHR()
}

main()
