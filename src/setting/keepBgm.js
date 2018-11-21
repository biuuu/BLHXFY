import config from '../config'

const keepBgm = () => {
  if (config.keepBgm) {
    window.addEventListener('blur', function (e) {
      e.stopImmediatePropagation()
    }, false)
  }
}

keepBgm()
