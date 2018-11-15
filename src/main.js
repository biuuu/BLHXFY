import injectXHR from './xhr'
import dlStoryCsv from './story/dlStoryCsv'
import previewCsv from './story/previewCsv'
import setting from './setting/'
import eventMessage from './utils/eventMessage'

const main = () => {
  if (window.blhxfy) return
  window.blhxfy = {
    dlStoryCsv, previewCsv,
    setting
  }
  eventMessage()
  injectXHR()
}

main()
