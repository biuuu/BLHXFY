import config from "../config"

export default function () {
  if (config.autoDownload) {
    let downloaded = false
    let win = window.unsafeWindow || window
    jQuery('#wrapper').off('click.blhxfy-dlcsv')
    .on('click.blhxfy-dlcsv', '.cnt-quest-scene .btn-skip', function () {
      setTimeout(() => {
        if (!document.querySelector('.pop-synopsis')) {
          win.blhxfy.sendEvent('dlStoryCsv')
          downloaded = true
        }
      }, 100)
    })
    jQuery('#wrapper').off('click.blhxfy-dlcsv2')
    .on('click.blhxfy-dlcsv2', '.pop-synopsis .btn-usual-ok,.btn-scene-skip', function () {
      if (!downloaded) {
        win.blhxfy.sendEvent('dlStoryCsv')
      }
    })
  }
}
