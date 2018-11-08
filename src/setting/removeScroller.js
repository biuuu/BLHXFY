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

removeScroller()
