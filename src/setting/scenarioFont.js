import config from '../config'

const insertCSS = fontValue => {
  let font = ''
  if (fontValue && fontValue !== 'none') font = `${fontValue}, `
  const style = document.createElement('style')
  style.innerHTML = `.prt-scene-comment :not(.blhxfy-origin-text), .prt-pop-synopsis, .prt-log-display, .btn-select-baloon {
    font-family: ${font}${Game.ua.os.name === 'Windows' ? 'blhxwf, ': '' }nickname_scene, "FOT-ニューシネマA Std D", "Average Sans", sans-serif !important;
  }`
  document.head.appendChild(style)
}

const setBold = () => {
  const style = document.createElement('style')
  style.innerHTML = `.prt-scene-comment, .prt-log-display, .btn-select-baloon {
    font-weight: bold;
  }`
  document.head.appendChild(style)
}

const scenarioFont = () => {
  if (!config.font) {
    if (Game.ua.os.name === 'Windows') {
      insertCSS('none')
    } else {
      insertCSS('none')
    }
  } else if (config.font !== 'none') {
    insertCSS(config.font)
  }
  if (config.fontBold) setBold()
}

export default scenarioFont
