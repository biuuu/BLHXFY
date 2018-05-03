window.addEventListener('load', () => {
  const style = document.createElement('style')
  style.innerHTML = `
  ::-webkit-scrollbar {
    display: none;
  }
  #prt-treasure-slider, .prt-head-current {
    -webkit-app-region: drag;
  }
  footer#treasure-footer .cnt-treasure-footer {
    height: 40px;
  }
  `
  document.head.appendChild(style)
  const footer = document.createElement('footer')
  footer.id = 'treasure-footer'
  footer.innerHTML = '<div class="cnt-treasure-footer"><div class="btn-treasure-footer-back"></div>						<div class="btn-treasure-footer-reload"></div>						<div class="btn-treasure-footer-mypage" data-href="mypage"></div>	<div id="prt-treasure-slider" class="prt-treasure-slider"><ul class="lis-treasures" id="treasure-list" data-treasure-max="9"></ul></div></div><div id="treasure-pop"></div>'
  document.getElementById('wrapper').appendChild(footer)
})
