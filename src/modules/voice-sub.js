import getVoiceData from '../store/voice-sub'
import config from '../config'

const voiceList = []

const saveList = async (data) => {
  const obj = data.data
  for (let key in obj) {
    let item = obj[key]
    for (let vkey in item) {
      let voice = item[vkey].replace(/\.[\w\d]+$/, '')
      if (!voiceList.includes(voice)) {
        voiceList.push(voice)
      }
    }
  }
}

const createBox = () => {
  const box = document.createElement('div')
  box.id = 'box-sub-blhxfy'
  box.innerHTML = '<div></div>'
  return box
}

let hideTimer = null
const hideBox = () => {
  let box = document.getElementById('box-sub-blhxfy')
  if (!box) return
  box.style.pointerEvents = 'none'
  box.style.opacity = 0
  box.style.transition = 'opacity 1.5s'
  clearTimeout(hideTimer)
}

const setSubBox = (text, duration) => {
  const cont = document.querySelector('.cnt-mypage') || document.querySelector('.cnt-detail .prt-image')
  if (!cont) return
  let box = document.getElementById('box-sub-blhxfy')
  if (!box) {
    box = createBox()
    cont.appendChild(box)
  }
  let _text = text
  if (config.userName && (config.userName !== '姬塔' || config.userName !== '古兰')) {
    _text = _text.replace(/(团长|姬塔)/g, config.displayName || config.userName)
  }
  box.querySelector('div').innerText = _text.replace(/\\n/g, '\n')
  setTimeout(() => {
    box.style.opacity = 1
    box.style.pointerEvents = 'auto'
    box.style.transition = 'opacity 0.5s'
  }, 100)
  clearTimeout(hideTimer)
  hideTimer = setTimeout(hideBox, duration * 1000)
  box.removeEventListener('click', hideBox)
  box.addEventListener('click', hideBox)
}

const showSub = async (src) => {
  if (!src) return
  hideBox()
  const voice = src.replace(/\.[\w\d]+$/, '')
  if (!voiceList.includes(voice)) return
  const voiceMap = await getVoiceData()
  if (!voiceMap.has(voice)) return
  const data = voiceMap.get(voice)
  setSubBox(data.trans, data.duration)
}

const setFont = () => {
  const css = `@font-face {
    font-family: 'blhxwf';
    font-style: normal;
    font-weight: normal;
    src: url('${config.origin}/blhxfy/data/static/webfont.woff2');
  }
  #box-sub-blhxfy {
    font-family: blhxwf, sans-serif;
  }`
  const tag = document.createElement('style')
  tag.innerHTML =css
  document.head.appendChild(tag)
}

let soundInjected = false
async function showVoiceSub(data, pathname, type) {
  if (!soundInjected) {
    require(['model/sound'], function (sound) {
      let playVoice = sound.prototype.playVoice
      sound.prototype.playVoice = function (src, force) {
        if (!Game.setting.sound_flag) return
        showSub(src)
        playVoice.call(this, src, force)
      }
    })
    setFont()
  }
  soundInjected = true
  if (type === 'list') {
    await saveList(data)
  } else {
    await showSub(pathname)
  }
}

const showVoiceSubL = async (data, pathname) => {
  return await showVoiceSub(data, pathname, 'list')
}

export { showVoiceSubL }
export default showVoiceSub