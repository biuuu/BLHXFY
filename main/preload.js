window.addEventListener('load', () => {
  const style = document.createElement('style')
  style.innerHTML = `
  ::-webkit-scrollbar {
    display: none;
  }
  `
  document.head.appendChild(style)
})
