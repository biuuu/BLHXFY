import start from './xhr'

const main = () => {
  if (window.blhxfy) return
  start()
  window.blhxfy = {
    dlStoryCsv:  function () {console.log(123)}
  }
}

main()
