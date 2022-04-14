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
  if (config.defaultFont) {
    css += `
    @font-face {
      font-family: 'blhxwf';
      font-style: normal;
      font-weight: normal;
      src: url('${config.origin}/blhxfy/data/static/webfont.woff2');
    }
    body {
      font-family: "FOT-ニューロダン Pro M","FOT-筑紫オールド明朝 Pro R","Average Sans", blhxwf, sans-serif;
    }`
  }
  if (css) {
    const style = document.createElement('style')
    style.innerHTML = css
    document.head.appendChild(style)
  }
}

const settingEtc = () => {
  addCss()
}

settingEtc()