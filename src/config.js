import { isDomain } from './utils/'
import isString from 'lodash/isString'
import isBoolean from 'lodash/isBoolean'
import isPlainObject from 'lodash/isPlainObject'
import filter from './utils/XSSFilter'
import { version } from '../package.json'

const config = {
  origin: 'https://blhx.danmu9.com',
  apiHosts: ['game.granbluefantasy.jp', 'gbf.game.mbga.jp'],
  hash: '',
  userName: '',
  displayName: '',
  defaultName: '姬塔',
  defaultEnName: 'Djeeta',
  storyOnly: false,
  font: '',
  fontBold: false,
  transApi: 'caiyun',
  timeout: 8,
  plainText: false,
  autoDownload: false,
  bottomToolbar: false,
  removeScroller: true,
  hideSidebar: false,
  battleTrans: true,
  showTranslator: true,
  log: false,
  localHash: '',
  transJa: true,
  transEn: true,
  originText: false,
  defaultFont: false,
  cacheTime: 30,
  version: version
}

const getLocalConfig = () => {
  const str = localStorage.getItem('blhxfy:setting')
  let setting = JSON.parse(str)
  if (!isPlainObject(setting)) setting = {}
  const { origin } = setting
  if (isDomain(origin)) {
    config.origin = origin.trim()
  }
  if (LOCAL_HOST) {
    config.origin = 'http://127.0.0.1:15945'
  }
  const keys = [
    'autoDownload', 'bottomToolbar', 'displayName', 'removeScroller', 'hideSidebar', 'originText', 'storyOnly', 'showTranslator',
    'transJa', 'transEn', 'font', 'fontBold', 'plainText', 'battleTrans', 'log', 'defaultFont'
  ]
  keys.forEach(key => {
    let value = setting[key]
    if (isString(value)) value = filter(value.trim())
    if (isBoolean(value) || value) {
      config[key] = value
    }
  })
}

const getLocalHash = () => {
  try {
    const str = sessionStorage.getItem('blhxfy:data')
    const data = JSON.parse(str)
    config.localHash = data.hash
  } catch (err) {
    // ignore
  }
}

getLocalConfig()
getLocalHash()

export default config
