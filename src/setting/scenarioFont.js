import config from '../config'

const insertCSS = fontValue => {
  const style = document.createElement('style')
  style.innerHTML = `.prt-scene-comment, .prt-log-display, .btn-select-baloon {
    font-family: ${fontValue} !important;
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
    insertCSS('jpkana, yaheiSymbol, "Microsoft Jhenghei", "Yu Gothic", "Meiryo", sans-serif')
  } else if (config.font !== 'none') {
    insertCSS(config.font)
  }
  if (config.fontBold) setBold()
}

scenarioFont()
