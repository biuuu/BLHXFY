const template = `
<style>
#btn-setting-blhxfy {
  position: absolute;
  left: 16px;
  top: 104px;
}
#blhxfy-setting-modal {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  background: #f6feff;
  width: 100%;
  min-height: 100%;
  z-index: 99999;
  padding-bottom: 38px;
}
#blhxfy-setting-modal input[type=text] {
  display: block !important;
  outline: none;
  width: 274px;
  font-size: 12px;
  padding: 4px;
  box-shadow: none;
  border: 1px solid #78bbd8;
  border-radius: 2px;
  font-family: sans-serif;
  color: #4d6671;
}
#blhxfy-setting-modal.show {
  display: block;
}
#blhxfy-setting-modal input[type=text]::placeholder {
  color: #aaa;
}
</style>
<div id="blhxfy-setting-modal">
<div class="cnt-setting">
	<div class="prt-setting-header"><img class="img-header" src="https://blhx.danmu9.com/blhxfy/data/static/image/setting-header.jpg" alt="header_public"></div>


	<div class="prt-setting-module">
		<div class="txt-setting-title">插件设置</div>
		<div class="prt-setting-frame">
			<div class="prt-setting-article">
				<div class="txt-article-title">翻译数据域名</div>
				<ul class="txt-article-lead">
					<li>留空则使用默认的数据源</li>
				</ul>
				<div class="prt-button-l">
          <input id="origin-setting-blhxfy" oninput="window.blhxfy.sendEvent('setting', 'origin', this.value)" type="text" value="" placeholder="https://blhx.danmu9.com">
        </div>
      </div>
      <div class="txt-setting-lead">
        ※使用第三方数据源有风险，请选择可以信任的数据源。
      </div>

      <div class="prt-setting-article">
				<div class="txt-article-title">主角名</div>
				<ul class="txt-article-lead">
					<li>剧情里显示的主角名字，留空则使用你自己的昵称</li>
				</ul>
				<div class="prt-button-l">
          <input id="username-setting-blhxfy" oninput="window.blhxfy.sendEvent('setting', 'username', this.value)" type="text" value="" placeholder="请输入主角名">
				</div>
			</div>

			<div class="prt-setting-article">
				<div class="txt-article-title">机翻设置</div>
				<ul class="txt-article-lead">
					<li>仅在脚本通过油猴插件加载时有效</li>
				</ul>
				<div class="prt-button">
					<div>
						<input id="trans-ja-setting-blhxfy" onchange="window.blhxfy.sendEvent('setting', 'trans-ja', this.checked)" type="checkbox" value="">
						<label for="trans-ja-setting-blhxfy" class="btn-usual-setting-new adjust-font-s">日语机翻</label>
					</div>
					<div>
						<input id="trans-en-setting-blhxfy" onchange="window.blhxfy.sendEvent('setting', 'trans-en', this.checked)" type="checkbox" value="">
						<label for="trans-en-setting-blhxfy" class="btn-usual-setting-new adjust-font-s">英语机翻</label>
					</div>
				</div>
				<div class="prt-button">
					<div class="prt-select-box">
						<div id="trans-api-setting-blhxfy-pulldown" class="prt-list-pulldown btn-sort">
							<div id="trans-api-setting-blhxfy-txt" class="txt-selected">彩云小译</div>
							<select id="trans-api-setting-blhxfy" class="frm-list-select" onchange="window.blhxfy.sendEvent('setting', 'trans-api', this.value)">
								<option value="caiyun" selected="">彩云小译</option>
								<option value="google">Google翻译</option>
							</select>
						</div>
					</div>
				</div>
			</div>

      <div class="prt-setting-article">
				<div class="txt-article-title">剧情CSV文件快捷下载</div>
				<ul class="txt-article-lead">
					<li>激活后在 SKIP 的时候自动下载剧情CSV</li>
				</ul>
				<div class="prt-button-l">
					<div>
						<input id="auto-download-setting-blhxfy" onchange="window.blhxfy.sendEvent('setting', 'auto-download', this.checked)" type="checkbox" value="">
						<label for="auto-download-setting-blhxfy" class="btn-usual-setting-new adjust-font-s">自动下载CSV</label>
					</div>
        </div>
			</div>

			<div class="prt-setting-article">
				<div class="txt-article-title">BGM设置</div>
				<ul class="txt-article-lead">
					<li>激活后在浏览器失去焦点后继续播放游戏声音</li>
				</ul>
				<div class="prt-button-l">
					<div>
						<input id="keep-bgm-setting-blhxfy" onchange="window.blhxfy.sendEvent('setting', 'keep-bgm', this.checked)" type="checkbox" value="">
						<label for="keep-bgm-setting-blhxfy" class="btn-usual-setting-new adjust-font-s">保持BGM播放</label>
					</div>
        </div>
      </div>

			<div class="prt-setting-article">
				<div class="txt-article-title">UI设置</div>
				<ul class="txt-article-lead">
					<li>可以隐藏Mobage侧边栏（PC网页）/显示底部工具栏（手机浏览器中）</li>
				</ul>
				<div class="prt-button">
					<div>
						<input id="remove-scroller-setting-blhxfy" onchange="window.blhxfy.sendEvent('setting', 'remove-scroller', this.checked)" type="checkbox" value="">
						<label for="remove-scroller-setting-blhxfy" class="btn-usual-setting-new adjust-font-s">隐藏滚动条</label>
					</div>
					<div>
						<input id="hide-sidebar-setting-blhxfy" onchange="window.blhxfy.sendEvent('setting', 'hide-sidebar', this.checked)" type="checkbox" value="">
						<label for="hide-sidebar-setting-blhxfy" class="btn-usual-setting-new adjust-font-s">隐藏侧边栏</label>
					</div>
					<div>
						<input id="bottom-toolbar-setting-blhxfy" onchange="window.blhxfy.sendEvent('setting', 'bottom-toolbar', this.checked)" type="checkbox" value="">
						<label for="bottom-toolbar-setting-blhxfy" class="btn-usual-setting-new adjust-font-s">底部工具栏</label>
					</div>
				</div>
			</div>

      <div class="txt-setting-lead">
        ※修改的设置在刷新页面后生效
      </div>
		</div>
	</div>

	<div class="prt-lead-link">
		<div class="lis-lead-prev" data-href="setting"><div class="atx-lead-link">返回设置</div></div>
		<div class="lis-lead-prev" data-href="mypage"><div class="atx-lead-link">返回首页</div></div>
	</div>
</div>
</div>
`
export default function (html) {
  return html.replace('<div class="cnt-setting">', `${template}<div class="cnt-setting"><div class="cnt-setting"><div class="btn-usual-text" id="btn-setting-blhxfy" onclick="window.blhxfy.sendEvent('setting', 'show')">汉化插件设置</div>`)
}

export { template as settingHtml }
