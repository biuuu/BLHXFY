import injectXHR from './xhr'
import dlStoryCsv from './story/dlStoryCsv'
import previewCsv from './story/previewCsv'

const main = () => {
  if (window.blhxfy) return
  injectXHR()
  window.blhxfy = {
    dlStoryCsv, previewCsv
  }
}

main()
