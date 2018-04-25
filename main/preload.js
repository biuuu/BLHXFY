window.addEventListener('load', () => {
  const style = document.createElement('style')
  style.innerHTML = `
  ::-webkit-scrollbar {
    display: none;
  }
  .prt-head-current {
    -webkit-app-region: drag;
  }
  `
  document.head.appendChild(style)
})
