import config from '../config'

const removeScroller = () => {
  if (config.removeScroller) {
    const style = document.createElement('style')
    style.innerHTML = `
      ::-webkit-scrollbar {
        display: none;
      }
    `
    document.head.appendChild(style)
  }
}

const hideSidebar = () => {
  if (config.hideSidebar) {
    document.body.classList.add('hide-sidebar-blhxfy')
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
  if (!config.storyOnly) {
    removeScroller()
    hideSidebar()
    keepBgm()
  }
}

settingEtc()