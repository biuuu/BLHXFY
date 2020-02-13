import config from '../config'

const addCss = () => {
  let css = ''
  if (config.removeScroller) {
    css += `
    ::-webkit-scrollbar {
      display: none;
    }`
  }
  if (config.hideSidebar) {
    css += `
    body>div:first-child>div:first-child>div:first-child[data-reactid] {
      display: none;
    }`
  }
  if (css) {
    const style = document.createElement('style')
    style.innerHTML = css
    document.head.appendChild(style)
  }
}

const keepBgm = () => {
  if (config.keepBgm) {
    window.addEventListener('blur', function (e) {
      e.stopImmediatePropagation()
    }, false)
  }
}

const settingEtc = () => {
  addCss()
  keepBgm()
}

settingEtc()