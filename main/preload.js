const fs = require('fs-extra')
const { ipcRenderer, remote } = require('electron')
const path = require('path')

const configPath = path.resolve(remote.app.getPath('userData'), 'config.json')
const CONFIG = fs.readJsonSync(configPath, { throws: false })

window.addEventListener('load', () => {
  if (!CONFIG.apiHostNames.includes(location.host)) return
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

  @font-face {
    font-family: 'yahei';
    font-style: normal;
    font-weight: 100;
    src: local('Microsoft Yahei');
    unicode-range: U+3000-303F, U+FF00-FFEF;
  }

  html body,
  html .prt-user-info .prt-info-profile .btn-user-name,
  .prt-scene-comment, .prt-log-display,
  .pop-synopsis .prt-pop-synopsis span,
  html .prt-user-name .txt-user-name {
      font-family: yahei, "Microsoft Jhenghei", "Yu Gothic", "Meiryo", sans-serif !important;
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
      font-family: yahei, Tahoma, Verdana, sans-serif !important;
  }

  div.btn-command-back,
  div.btn-attack-start,
  div.btn-lock,
  div.btn-command-summon,
  div.prt-sub-command > div.btn-temporary,
  div.quick-button,
  div.quick-summon {
      font-family: yahei, Tahoma, Verdana, sans-serif !important;
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
  const link = document.createElement('link')
  link.setAttribute('type', 'text/css')
  link.setAttribute('rel', 'stylesheet')
  link.setAttribute('href', `http://127.0.0.1:${CONFIG.staticPort}/style/ui-cover.css`)
  document.head.prepend(link)
  document.head.prepend(style)
  const footer = document.createElement('footer')
  footer.id = 'treasure-footer'
  footer.innerHTML = '<div class="cnt-treasure-footer"><div class="btn-treasure-footer-back"></div>						<div class="btn-treasure-footer-reload"></div>						<div class="btn-treasure-footer-mypage" data-href="mypage"></div>	<div id="prt-treasure-slider" class="prt-treasure-slider"><ul class="lis-treasures" id="treasure-list" data-treasure-max="9"></ul></div></div><div id="treasure-pop"></div>'
  document.getElementById('wrapper').appendChild(footer)
})
