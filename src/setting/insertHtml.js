const template = `
<style>
#wrapper .cnt-setting #btn-setting-blhxfy {
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
.autotrans-hint-blhxfy.ai-blhxfy:after {
  content: "AI";
  background-color: #4d6671;
  color: #fff;
}
</style>
<div id="blhxfy-setting-modal">
<div class="cnt-setting">
	<div class="prt-setting-header"><img class="img-header" src="https://blhx.danmu9.com/blhxfy/data/static/image/setting-header.jpg" alt="header_public"></div>

	<div class="prt-setting-module ">
		<div class="txt-setting-title">插件设置</div>

		<div class="block-story-only prt-button">
			<input id="story-only-setting-blhxfy" onchange="window.blhxfy.sendEvent('setting', 'story-only', this.checked)" type="checkbox" value="">
			<label for="story-only-setting-blhxfy" class="btn-usual-setting-new adjust-font-s">只翻译剧情</label>
		</div>

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
					<li>在没有人工翻译的情况下尝试机翻</li>
				</ul>
				<div class="prt-button" style="display:flex;flex-wrap:wrap;">
					<div style="width:100%">
						<input id="ai-trans-setting-blhxfy" onchange="window.blhxfy.sendEvent('setting', 'ai-trans', this.checked); document.getElementById('ai-settings-group').style.display = this.checked ? 'block' : 'none'" type="checkbox" value="">
						<label for="ai-trans-setting-blhxfy" class="btn-usual-setting-new adjust-font-s">AI 机翻</label>
					</div>
					<ul class="txt-article-lead" style="margin-bottom:10px;">
						<li>支持 OpenAI 格式接口</li>
					</ul>
					
					<div id="ai-settings-group" style="margin: 10px 0; padding: 10px; border: 1px solid #78bbd8; border-radius: 4px; display: none; width: calc(100% - 22px);">
						<div style="margin-bottom:10px; display: flex; align-items: center;">
							<div class="txt-article-title" style="font-size:10px; flex: 0 0 60px; margin-bottom: 0;">API密钥</div>
							<input style="flex: 1; box-sizing: border-box;" id="ai-api-key-setting-blhxfy" oninput="window.blhxfy.sendEvent('setting', 'ai-api-key', this.value)" type="text" value="" placeholder="sk-...">
						</div>
						<div style="margin-bottom:10px; display: flex; align-items: center;">
							<div class="txt-article-title" style="font-size:10px; flex: 0 0 60px; margin-bottom: 0;">API地址</div>
							<input style="flex: 1; box-sizing: border-box;" id="ai-api-endpoint-setting-blhxfy" oninput="window.blhxfy.sendEvent('setting', 'ai-api-endpoint', this.value)" type="text" value="" placeholder="https://api.example.com/v1">
						</div>
						<div style="display: flex; align-items: center;">
							<div class="txt-article-title" style="font-size:10px; flex: 0 0 60px; margin-bottom: 0;">模型名称</div>
							<input style="flex: 1; box-sizing: border-box;" id="ai-model-setting-blhxfy" oninput="window.blhxfy.sendEvent('setting', 'ai-model', this.value)" type="text" value="" placeholder="model-name">
						</div>
					</div>

					<div style="width:100%">
						<input id="traditional-trans-setting-blhxfy" onchange="window.blhxfy.sendEvent('setting', 'traditional-trans', this.checked)" type="checkbox" value="">
						<label for="traditional-trans-setting-blhxfy" class="btn-usual-setting-new adjust-font-s">传统机翻</label>
					</div>
					<ul class="txt-article-lead">
						<li>使用彩云小译接口</li>
					</ul>
				</div>
			</div>

			<div class="prt-setting-article">
				<div class="txt-article-title">字体设置</div>
				<ul class="txt-article-lead">
					<li>剧情文本使用的字体。</li>
				</ul>
				<div class="prt-button">
					<input style="width:180px;margin-right:10px" id="font-setting-blhxfy" oninput="window.blhxfy.sendEvent('setting', 'font', this.value)" type="text" value="" placeholder="请输入字体">
					<div>
						<input id="font-bold-setting-blhxfy" onchange="window.blhxfy.sendEvent('setting', 'font-bold', this.checked)" type="checkbox" value="">
						<label style="top:2px" for="font-bold-setting-blhxfy" class="btn-usual-setting-new adjust-font-s">加粗</label>
					</div>
				</div>
			</div>

			<div class="txt-setting-lead">
        ※格式同CSS的font-family。填 none 则不修改字体，显示游戏默认字体效果。
      </div>

      <div class="prt-setting-article">
				<div class="txt-article-title">战斗界面的技能翻译</div>
				<ul class="txt-article-lead">
					<li>激活后在汉化战斗界面的技能按钮</li>
				</ul>
				<div class="prt-button-l">
					<div>
						<input id="battle-trans-setting-blhxfy" onchange="window.blhxfy.sendEvent('setting', 'battle-trans', this.checked)" type="checkbox" value="">
						<label for="battle-trans-setting-blhxfy" class="btn-usual-setting-new adjust-font-s">启用</label>
					</div>
        </div>
			</div>

			<div class="prt-setting-article">
				<div class="txt-article-title">剧情CSV文件快捷下载</div>
				<ul class="txt-article-lead">
					<li>激活后在 SKIP 的时候自动下载剧情CSV（此功能仅供译者使用，这里的下载文件并不是指加载数据）</li>
				</ul>
				<div class="prt-button-l">
					<div>
						<input id="auto-download-setting-blhxfy" onchange="window.blhxfy.sendEvent('setting', 'auto-download', this.checked)" type="checkbox" value="">
						<label for="auto-download-setting-blhxfy" class="btn-usual-setting-new adjust-font-s">自动下载CSV</label>
					</div>
        </div>
			</div>

			<div class="prt-setting-article">
				<div class="txt-article-title">其他设置</div>
				<ul class="txt-article-lead">
					<li>可以选择隐藏网页滚动条 / 隐藏Mobage侧边栏（仅PC网页） / 在后台播放BGM</li>
				</ul>
				<div class="prt-button" style="flex-wrap: wrap;display: flex;">
					<div>
						<input id="remove-scroller-setting-blhxfy" onchange="window.blhxfy.sendEvent('setting', 'remove-scroller', this.checked)" type="checkbox" value="">
						<label for="remove-scroller-setting-blhxfy" class="btn-usual-setting-new adjust-font-s">隐藏滚动条</label>
					</div>
					<div>
						<input id="hide-sidebar-setting-blhxfy" onchange="window.blhxfy.sendEvent('setting', 'hide-sidebar', this.checked)" type="checkbox" value="">
						<label for="hide-sidebar-setting-blhxfy" class="btn-usual-setting-new adjust-font-s">隐藏侧边栏</label>
					</div>
					<div>
						<input id="default-font-setting-blhxfy" onchange="window.blhxfy.sendEvent('setting', 'default-font', this.checked)" type="checkbox" value="">
						<label for="default-font-setting-blhxfy" class="btn-usual-setting-new adjust-font-s">调整字体</label>
					</div>
					<div style="margin-top:5px;">
						<input id="origin-text-setting-blhxfy" onchange="window.blhxfy.sendEvent('setting', 'origin-text', this.checked);window.blhxfy.sendEvent('setting', 'fast-mode', event);" type="checkbox" value="" data-post-name="scene_fast_text_mode" name="scene-fast-text-mode">
						<label for="origin-text-setting-blhxfy" class="btn-usual-setting-new adjust-font-s">原文对照</label>
					</div>
					<div style="margin-top:5px;">
						<input id="show-translator-setting-blhxfy" onchange="window.blhxfy.sendEvent('setting', 'show-translator', this.checked);" type="checkbox" value="">
						<label for="show-translator-setting-blhxfy" class="btn-usual-setting-new adjust-font-s">显示译者</label>
					</div>
					<div style="margin-top:5px;">
						<input id="log-setting-blhxfy" onchange="window.blhxfy.sendEvent('setting', 'log', this.checked);" type="checkbox" value="">
						<label for="log-setting-blhxfy" class="btn-usual-setting-new adjust-font-s">显示Log</label>
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
const templateForWheel = `
<style>
#blhxfy-setting-modal {
	height: 100%;
	overflow: auto;
}
</style>
`
const wheelStopPg = (e) => {
	e.stopImmediatePropagation()
}
export default function (html) {
	html = html.replace('<div class="cnt-setting">', `${template}<div class="cnt-setting"><div class="cnt-setting"><div class="btn-usual-text" id="btn-setting-blhxfy" onclick="window.blhxfy.sendEvent('setting', 'show')">汉化插件设置</div>`)
	if (location.hash !== '#setting') {
		html = html.replace('<div class="btn-usual-text" id="btn-setting-blhxfy"', `${templateForWheel}<div class="btn-usual-text" id="btn-setting-blhxfy"`)
		setTimeout(() => {
			const modal = document.getElementById('blhxfy-setting-modal')
			modal.removeEventListener('wheel', wheelStopPg)
			modal.removeEventListener('DOMMouseScroll', wheelStopPg)
			modal.removeEventListener('mousewheel', wheelStopPg)
			modal.addEventListener('wheel', wheelStopPg, false)
			modal.addEventListener('DOMMouseScroll', wheelStopPg, false)
			modal.addEventListener('mousewheel', wheelStopPg, false)
		}, 1000)
	}
	return html
}

export { template as settingHtml }
