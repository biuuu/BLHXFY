import start from './xhr'
import dlStoryCsv from './story/dlStoryCsv'
import previewCsv from './story/previewCsv'

const main = () => {
  if (window.blhxfy) return
  start()
  window.blhxfy = {
    dlStoryCsv, previewCsv
  }
}

main()
