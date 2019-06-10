const fixModalPos = () => {
  if (!/mobile/i.test(navigator.userAgent)) {
    const style = document.createElement('style')
    style.innerHTML = `
    html,body{
      height:100vh;
      overflow:auto;
    }
    `
    document.head.appendChild(style)
  }
}

fixModalPos()
