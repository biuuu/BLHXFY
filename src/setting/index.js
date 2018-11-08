import './bottomToolbar'
import './insertMeta'
import './removeScroller'
import debounce from 'lodash/debounce'
import isPlainObject from 'lodash/isPlainObject'
import config from '../config'

const saveToLocalstorage = (key, value) => {
  let data
  try {
    const str = localStorage.getItem('blhxfy:setting')
    data = JSON.parse(str)
  } catch (err) {
    console.error(err)
  }

  if (!isPlainObject(data)) {
    data = {}
  }
  data[key] = value
  localStorage.setItem('blhxfy:setting', JSON.stringify(data))
}

const keyMap = new Map([
  ['origin', 'origin'],
  ['auto-download', 'autoDownload'],
  ['bottom-toolbar', 'bottomToolbar'],
  ['username', 'displayName'],
  ['remove-scroller', 'removeScroller']
])

const setting = (type, value) => {
  if (type === 'show') {
    for (let [id, key] of keyMap) {
      const ipt = $(`#${id}-setting-blhxfy`)
      if (ipt.attr('type') === 'checkbox') {
        ipt[0].checked = config[key]
      } else {
        ipt.val(config[key])
      }
    }
    $('#blhxfy-setting-modal').addClass('show')
  } else {
    saveToLocalstorage(keyMap.get(type), value)
  }
}

const dbSetting = debounce(setting, 500)

export default dbSetting
