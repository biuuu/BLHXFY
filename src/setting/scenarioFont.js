import config from '../config'

const insertCSS = fontValue => {
  const style = document.createElement('style')
  style.innerHTML = `.prt-scene-comment, .prt-pop-synopsis, .prt-log-display, .btn-select-baloon {
    font-family: ${fontValue}, nickname_scene, "FOT-ニューシネマA Std D", "Average Sans", sans-serif !important;
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
      insertCSS('jpkana, FZShuiYJW, "Microsoft Jhenghei", "Yu Gothic", "Meiryo", sans-serif')
    } else {
      insertCSS('jpkana, sans-serif')
    }
  } else if (config.font !== 'none') {
    insertCSS(config.font)
  }
  if (config.fontBold) setBold()
}

export default scenarioFont
