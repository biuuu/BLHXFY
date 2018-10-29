const template = `
<style>
#btn-setting-blhxfy {
  position: absolute;
  left: 16px;
  top: 104px;
}
#blhxfy-setting-modal {
  position: absolute;
  top: 0;
  left: 0;
  background: #f6feff;
  width: 100%;
  height: 100%;
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
#blhxfy-setting-modal input[type=text]::placeholder {
  color: #aaa;
}
</style>
<div class="btn-usual-text" id="btn-setting-blhxfy">汉化插件设置</div>
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
          <input id="friend-allow-flag" type="text" value="" placeholder="https://blhx.danmu9.com">
        </div>
      </div>
      <div class="txt-setting-lead">
        ※使用第三方数据源有风险，请选择可以信任的数据源。
      </div>

			<div class="prt-setting-article">
				<div class="txt-article-title">显示底部工具栏</div>
				<ul class="txt-article-lead">
					<li>在手机浏览器上也显示底部工具栏</li>
				</ul>
				<div class="prt-button-l">
					<div>
						<input id="friend-request-flag" type="checkbox" value="">
						<label for="friend-request-flag" class="btn-usual-setting-new adjust-font-s">底部工具栏</label>
					</div>
				</div>
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
  return html.replace('<div class="cnt-setting">', `${template}<div class="cnt-setting">`)
}
