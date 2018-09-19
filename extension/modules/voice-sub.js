import getVoiceData from '../store/voice-sub'

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
  const cont = document.querySelector('.cnt-mypage .prt-user-scene')
  if (!cont) return
  let box = document.getElementById('box-sub-blhxfy')
  if (!box) {
    box = createBox()
    cont.appendChild(box)
  }
  box.innerText = text.replace(/\\n/g, '\n')
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
  // const rgs = pathname.match(/\/assets\/sound\/([^.]+)\.[\w\d]+$/)
  // if (!rgs || !rgs[1]) return
  hideBox()
  const voice = src.replace(/\.[\w\d]+$/, '')
  if (!voiceList.includes(voice)) return
  const voiceMap = await getVoiceData()
  if (!voiceMap.has(voice)) return
  const data = voiceMap.get(voice)
  setSubBox(data.trans, data.duration)
}

let soundInjected = false
export default async function showVoiceSub(data, pathname, type) {
  if (!soundInjected) {
    require(['model/sound'], function (sound) {
      let playVoice = sound.prototype.playVoice
      sound.prototype.playVoice = function (src, force) {
        showSub(src)
        playVoice.call(this, src, force)
      }
    })
  }
  soundInjected = true
  if (type === 'list') {
    await saveList(data)
  } else {
    await showSub(pathname)
  }
}
