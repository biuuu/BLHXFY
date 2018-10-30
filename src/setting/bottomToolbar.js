import config from '../config'

const addToolbar = () => {
  if (config.bottomToolbar) {
    document.addEventListener('DOMContentLoaded', function () {
      if (!document.querySelector('#treasure-footer')) {
        document.querySelector('.cnt-global-footer').insertAdjacentHTML('afterend', `
        <footer id="treasure-footer">
          <div class="cnt-treasure-footer" style="height:40px">
            <div class="btn-treasure-footer-back"></div>
            <div class="btn-treasure-footer-reload"></div>
            <div class="btn-treasure-footer-mypage" data-href="mypage"></div>
            <div id="prt-treasure-slider" class="prt-treasure-slider">
              <ul class="lis-treasures" id="treasure-list" data-treasure-max="9"></ul>
            </div>
          </div>
          <div id="treasure-pop"></div>
        </footer>
        `)
      }
    })
  }
}

addToolbar()
