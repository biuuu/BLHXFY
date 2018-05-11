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
  /* latin-ext */
  @font-face {
    font-family: 'vmLato';
    font-style: normal;
    font-weight: 400;
    src: local('Lato Regular'), local('Lato-Regular'), url(http://127.0.0.1:8003/default/font/lato/UyBMtLsHKBKXelqf4x7VRQ.woff2) format('woff2');
    unicode-range: U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;
  }
  /* latin */
  @font-face {
    font-family: 'vmLato';
    font-style: normal;
    font-weight: 400;
    src: local('Lato Regular'), local('Lato-Regular'), url(http://127.0.0.1:8003/default/font/lato/1YwB1sO8YE1Lyjf12WNiUA.woff2) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000;
  }
  /* latin-ext */
  @font-face {
    font-family: 'vmLato';
    font-style: normal;
    font-weight: 700;
    src: local('Lato Bold'), local('Lato-Bold'), url(http://127.0.0.1:8003/default/font/lato/ObQr5XYcoH0WBoUxiaYK3_Y6323mHUZFJMgTvxaG2iE.woff2) format('woff2');
    unicode-range: U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;
  }
  /* latin */
  @font-face {
    font-family: 'vmLato';
    font-style: normal;
    font-weight: 700;
    src: local('Lato Bold'), local('Lato-Bold'), url(http://127.0.0.1:8003/default/font/lato/H2DMvhDLycM56KNuAtbJYA.woff2) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000;
  }
  /* latin-ext */
  @font-face {
    font-family: 'vmLato';
    font-style: normal;
    font-weight: 900;
    src: local('Lato Black'), local('Lato-Black'), url(http://127.0.0.1:8003/default/font/lato/R4a6fty3waPci7C44H8AjvY6323mHUZFJMgTvxaG2iE.woff2) format('woff2');
    unicode-range: U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;
  }
  /* latin */
  @font-face {
    font-family: 'vmLato';
    font-style: normal;
    font-weight: 900;
    src: local('Lato Black'), local('Lato-Black'), url(http://127.0.0.1:8003/default/font/lato/tI4j516nok_GrVf4dhunkg.woff2) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000;
  }
  /* latin-ext */
  @font-face {
    font-family: 'vmLato';
    font-style: italic;
    font-weight: 400;
    src: local('Lato Italic'), local('Lato-Italic'), url(http://127.0.0.1:8003/default/font/lato/YMOYVM-eg6Qs9YzV9OSqZfesZW2xOQ-xsNqO47m55DA.woff2) format('woff2');
    unicode-range: U+0100-024F, U+1E00-1EFF, U+20A0-20AB, U+20AD-20CF, U+2C60-2C7F, U+A720-A7FF;
  }
  /* latin */
  @font-face {
    font-family: 'vmLato';
    font-style: italic;
    font-weight: 400;
    src: local('Lato Italic'), local('Lato-Italic'), url(http://127.0.0.1:8003/default/font/lato/PLygLKRVCQnA5fhu3qk5fQ.woff2) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000;
  }
  body,
  .prt-user-info .prt-info-profile .btn-user-name,
  .prt-user-name .txt-user-name {
      font-family: vmLato, "FOT-テロップ明朝 Pro D", "Average Sans", sans-serif !important;
  }

  html[lang="ja"] body,
  html[lang="ja"] .prt-user-info .prt-info-profile .btn-user-name,
  html[lang="ja"] .prt-user-name .txt-user-name {
      font-family: vmLato, "FOT-テロップ明朝 Pro D", "Average Sans", "Yu Gothic", "Meiryo", sans-serif !important;
  }

  div.skill-queue,
  div.debuff-timers,
  div.buff-timers,
  div.lis-ability > div:first-child,
  div.lis-ability-state,
  div.number-container,
  div.raid.joined:after,
  div.watch-button,
  span.class-change-button,
  span.weapon-change-button {
      font-family: vmLato, Tahoma, Verdana, sans-serif !important;
  }

  div.btn-command-back,
  div.btn-attack-start,
  div.btn-lock,
  div.btn-command-summon,
  div.prt-sub-command > div.btn-temporary,
  div.quick-button,
  div.quick-summon {
      font-family: vmLato, Tahoma, Verdana, sans-serif !important;
  }

  div.txt-bp-remaining,
  div.txt-stamina-remaining,
  div.prt-head-current {
      padding-top: 5px !important;
  }

  div.prt-info-possessed > div.prt-lupi,
  div.prt-stone,
  div.prt-jp,
  div.prt-rawstone,
  div.prt-mbp-possessed > div.prt-mbp-box,
  div.prt-mbp-possessed > div.prt-hmbp-box {
      padding-top: 3px !important;
  }

  div.prt-quest-list div.txt-free-campaign {
      margin-left: -7px !important;
  }

  div.prt-percent {
      padding-top: 1px;
  }

  div.quick-summon.unavailable:after {
      padding-top: 1px;
  }

  div.cnt-exchange div#prt-change-list div.prt-npc-name {
      top: 52px !important;
  }

  div.prt-assault-infomation div.txt-assault-setting {
      padding-left: 15px !important;
      padding-right: 15px !important;
  }

  .prt-weapon-main-status-skill .prt-skill .prt-slv-value {
      bottom: 2px !important;
  }

  .cnt-weapon-list .prt-weapon-list .prt-skill .prt-slv-value {
      bottom: 3px !important;
  }
  `
  document.head.appendChild(style)
  const footer = document.createElement('footer')
  footer.id = 'treasure-footer'
  footer.innerHTML = '<div class="cnt-treasure-footer"><div class="btn-treasure-footer-back"></div>						<div class="btn-treasure-footer-reload"></div>						<div class="btn-treasure-footer-mypage" data-href="mypage"></div>	<div id="prt-treasure-slider" class="prt-treasure-slider"><ul class="lis-treasures" id="treasure-list" data-treasure-max="9"></ul></div></div><div id="treasure-pop"></div>'
  document.getElementById('wrapper').appendChild(footer)
})
