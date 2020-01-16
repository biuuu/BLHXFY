import { settingHtml } from '../setting/insertHtml'
import config from '../config'

const extraHtml = settingHtml.replace('data-href="setting"', 'onclick="window.blhxfy.sendEvent(\'setting\', \'hide\')"').replace('返回设置', '返回剧情')

const html = `
<style>
@font-face {
  font-family: 'blhxwf';
  font-style: normal;
  font-weight: normal;
  src: url('${config.origin}/blhxfy/data/static/webfont.otf');
}
.cnt-quest-scene .prt-log-display {
  padding-top: 74px;
}
#blhxfy-story-tool {
  display: none;
}
#blhxfy-story-tool > div {
  width: 152px;
  margin: 7px auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
#blhxfy-story-input button,
#blhxfy-story-tool button {
  border: none;
  background: none;
  cursor: pointer;
  padding: 4px 6px;
  font-size: 10px;
  margin: 0;
  letter-spacing: 1px;
  line-height: 1;
  outline: none;
  position: relative;
  transition: none;
  border-radius: 3px;
  background: #539cba;
  color: #fff;
  box-shadow: 0 3px #165c85;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5)
}

#blhxfy-story-input button:hover,
#blhxfy-story-tool button:hover {
  box-shadow: 0 2px #165c85;
  top: 1px;
}
#blhxfy-story-input button:active,
#blhxfy-story-tool button:active {
  box-shadow: 0 1px #165c85;
  top: 2px;
}
.log #blhxfy-story-tool {
  display: block;
  position: absolute;
  top: 26px;
  left: 50%;
  width: 180px;
  margin-left: -90px;
  z-index: 9999;
  text-align: center;
}
#blhxfy-story-input {
  position: absolute;
  display: none;
  top: 0;
  left: 0;
  width: 320px;
  height: 100%;
  background: #fff;
  z-index: 10000;
}
.blhxfy-preview-tool {
  padding-top: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e3e3e3;
  display: flex;
  justify-content: space-between;
  padding-left: 10px;
  padding-right: 10px;
  background: #116d82;
}
#blhxfy-story-input p {
  margin: 10px 10px 0 10px;
  color: #5b8690;
  text-align: left;
  font-size: 10px;
  position: relative;
}
#blhxfy-story-input p a {
  color: #29b82d;
  position: absolute;
  cursor: pointer;
  padding: 4px;
  right: 0;
  top: -5px;
}
#blhxfy-story-input textarea {
  width: 300px;
  height: calc(100% - 80px);
  margin: 10px;
  box-sizing: border-box;
  font-size: 8px;
  padding: 4px;
  border-radius: 2px;
  box-shadow: inset 0 0 3px #2c88d775;
  outline: none;
  resize: none;
  font-family: Consolas, "Microsoft Yahei";
}
.language-setting-blhxfy {
  font-size: 10px;
  color: #fff;
  top: 1px;
  position: relative;
  font-family: Microsoft Jhenghei;
}
.language-setting-blhxfy select {
  border: none;
  border-radius: 2px;
}
.blhxfy-story-plaintext {
  position: absolute;
  right: -33px;
  top: 8px;
  color: #fff;
  width: auto !important;
  font-size: 8px;
}
</style>
<div id="blhxfy-story-tool">
  <div class="blhxfy-story-plaintext">
    <input id="plain-text-blhxfy" type="checkbox" onchange="window.blhxfy.sendEvent('setting', 'plain-text', this.checked)">
    <label for="plain-text-blhxfy" style="padding-left:2px" title="勾选后，下载的csv文件会去掉里面的html代码">纯文本</label>
  </div>
  <div>
    <button onclick="window.blhxfy.sendEvent('dlStoryCsv')" title="下载未翻译的剧情文本">原文</button>
    <button onclick="window.blhxfy.sendEvent('dlStoryCsv', 'fill')" title="下载用原文填充trans列的剧情文本">填充</button>
    <button onclick="window.blhxfy.sendEvent('dlStoryCsv', 'trans')" title="下载已翻译的剧情文本">译文</button>
    <button onclick="window.blhxfy.sendEvent('previewCsv', 'show')" title="填写翻译好的剧情文本来预览">预览</button>
  </div>
  <div>
    <div class="language-setting-blhxfy">
      <span>语言：</span>
      <select id="language-type-blhxfy" onchange="window.blhxfy.sendEvent('setting', 'language', event)" class="frm-list-select frm-post-async is-reload" data-post-name="language_type">
        <option value="1">日本語</option>
        <option value="2">English</option>
      </select>
    </div>
    <button onclick="window.blhxfy.sendEvent('setting', 'show')" title="插件设置">设置</button>
  </div>
</div>
<div id="blhxfy-story-input">
  <div class="blhxfy-preview-tool">
    <button onclick="window.blhxfy.sendEvent('previewCsv', 'hide')">取消</button>
    <button onclick="window.blhxfy.sendEvent('previewCsv', 'save')" title="保存预览文本并刷新页面">保存</button>
  </div>
  <p>请将编辑好的剧情文本粘贴到文本框<a onclick="window.blhxfy.sendEvent('previewCsv', 'clear')" title="清除预览文本">清空</a></p>
  <textarea placeholder="剧情文本"></textarea>
</div>
<link type="text/css" rel="stylesheet" href="${Game.cssUri}/setting/index.css">
${extraHtml}
`
export default function () {
  const cont = $('.cnt-quest-scene')
  const tool = $('#blhxfy-story-tool')
  if (tool[0]) return
  if (cont[0]) {
    cont.prepend(html)
    const langVal = { ja: 1, en: 2 }
    $('#language-type-blhxfy').val(langVal[Game.lang])
    $('#plain-text-blhxfy')[0].checked = config.plainText
    if (config.originText) {
      cont.find('.prt-scene-comment').prepend(`<div class="blhxfy-btn-origin-text"></div>`)
    }
  }
}
