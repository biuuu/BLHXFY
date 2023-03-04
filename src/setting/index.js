import './etc'
import throttle from 'lodash/throttle'
import config from '../config'

const saveToLocalstorage = (key, value) => {
  let data
  try {
    const str = localStorage.getItem('blhxfy:setting')
    data = JSON.parse(str)
  } catch (err) {
    console.error(err)
  }

  if (!data || typeof data !== 'object') {
    data = {}
  }
  data[key] = value
  config[key] = value
  localStorage.setItem('blhxfy:setting', JSON.stringify(data))
}

const keyMap = new Map([
  ['origin', 'origin'],
  ['auto-download', 'autoDownload'],
  ['bottom-toolbar', 'bottomToolbar'],
  ['username', 'displayName'],
  ['remove-scroller', 'removeScroller'],
  ['hide-sidebar', 'hideSidebar'],
  ['trans-ja', 'transJa'],
  ['trans-en', 'transEn'],
  ['trans-api', 'transApi'],
  ['story-only', 'storyOnly'],
  ['show-translator', 'showTranslator'],
  ['font', 'font'],
  ['log', 'log'],
  ['font-bold', 'fontBold'],
  ['plain-text', 'plainText'],
  ['battle-trans', 'battleTrans'],
  ['origin-text', 'originText'],
  ['default-font', 'defaultFont']
])

const setting = (type, value) => {
  if (type === 'show') {
    for (let [id, key] of keyMap) {
      const ipt = jQuery(`#${id}-setting-blhxfy`)
      if (!ipt.length) continue
      if (ipt.attr('type') === 'checkbox') {
        ipt[0].checked = config[key]
      } else if (ipt[0].tagName.toUpperCase() === 'SELECT') {
        ipt.val(config[key])
        const text = ipt.find('option:selected').text()
        jQuery(`#${id}-setting-blhxfy-txt`).text(text)
      } else {
        ipt.val(config[key])
      }
    }
    jQuery('#blhxfy-setting-modal').addClass('show')
  } else if (type === 'hide') {
    jQuery('#blhxfy-setting-modal').removeClass('show')
  } else if (type === 'language' || type === 'fast-mode') {
    require(['view/setting/index'], function (sett) {
      sett.prototype.onChangePostAsyncInput({ currentTarget: value.target})
    })
  } else {
    if (type === 'trans-api') {
      const text = jQuery('#trans-api-setting-blhxfy').find('option:selected').text()
      jQuery('#trans-api-setting-blhxfy-txt').text(text)
    }
    saveToLocalstorage(keyMap.get(type), value)
  }
}

const thSetting = throttle(setting, 300)

export default thSetting