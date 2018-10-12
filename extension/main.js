import start from './xhr'
import dlStoryCsv from './story/dlStoryCsv'

const main = () => {
  if (window.blhxfy) return
  start()
  window.blhxfy = {
    dlStoryCsv
  }
}

main()
