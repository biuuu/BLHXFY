const html = `
<style>
#blhxfy-story-tool {
  display: none;
}
#blhxfy-story-tool button {
  border: none;
  background: none;
  cursor: pointer;
  padding: 4px;
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
}

#blhxfy-story-tool button:hover {
  box-shadow: 0 2px #165c85;
  top: 1px;
}
#blhxfy-story-tool button:active {
  box-shadow: 0 1px #165c85;
  top: 2px;
}

#blhxfy-story-tool button:after {
	content: '';
	position: absolute;
	z-index: -1;
	-webkit-transition: all 0.3s;
	-moz-transition: all 0.3s;
	transition: all 0.3s;
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
</style>
<div id="blhxfy-story-tool">
  <button onclick="window.blhxfy.dlStoryCsv()">下载</button>
  <button onclick="window.blhxfy.previewCsv()">预览</button>
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
