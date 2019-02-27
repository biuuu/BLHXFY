import config from "../config"

export default function () {
  if (config.autoDownload) {
    let downloaded = false
    $('#wrapper').off('click.blhxfy-dlcsv')
    .on('click.blhxfy-dlcsv', '.cnt-quest-scene .btn-skip', function () {
      setTimeout(() => {
        if (!document.querySelector('.pop-synopsis')) {
          window.blhx.sendEvent('dlStoryCsv')
          downloaded = true
        }
      }, 100)
    })
    $('#wrapper').off('click.blhxfy-dlcsv2')
    .on('click.blhxfy-dlcsv2', '.pop-synopsis .btn-usual-ok', function () {
      if (!downloaded) {
        window.blhx.sendEvent('dlStoryCsv')
      }
    })
  }
}
