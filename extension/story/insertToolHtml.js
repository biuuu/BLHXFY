const html = `
<style>
#blhxfy-story-tool {
  display: none;
}
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

#blhxfy-story-tool button:hover {
  box-shadow: 0 2px #165c85;
  top: 1px;
}
#blhxfy-story-tool button:active {
  box-shadow: 0 1px #165c85;
  top: 2px;
}

.log #blhxfy-story-tool {
  display: block;
  position: absolute;
  top: 33px;
  left: 0;
  width: 100%;
  z-index: 9999;
  text-align: center;
}
#blhxfy-story-input {
  position: fixed;
  display: none;
  top: 0;
  left: 0;
  width: 320px;
  height: 100vh;
}
</style>
<div id="blhxfy-story-tool">
  <button onclick="window.blhxfy.dlStoryCsv()" title="下载未翻译的剧情文本">原文</button>
  <button onclick="window.blhxfy.dlStoryCsv('fill')" title="下载用原文填充trans列的剧情文本">填充</button>
  <button onclick="window.blhxfy.dlStoryCsv('trans')" title="下载带翻译的剧情文本">译文</button>
  <button onclick="window.blhxfy.previewCsv()" title="填写已翻译的剧情文本来预览">预览</button>
  <button onclick="window.blhxfy.previewCsv()" title="清除预览文本">清除</button>
  <div id="blhxfy-story-input">
    <div>
      <button onclick="window.blhxfy.previewCsv()">取消</button>
      <button onclick="window.blhxfy.previewCsv()" title="保存预览文本并刷新页面">保存</button>
    </div>
    <p>请将编辑好的剧情文本粘贴到文本框</p>
    <textarea placeholder="id,en,jp,trans\n……"></textarea>
  </div>
</div>
`
export default function () {
  const cont = $('.cnt-quest-scene')
  const tool = $('#blhxfy-story-tool')
  if (tool[0]) return
  if (cont[0]) {
    cont.prepend(html)
  }
}
