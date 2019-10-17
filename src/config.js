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
  font: '',
  fontBold: false,
  transApi: 'google',
  timeout: 8,
  plainText: false,
  autoDownload: false,
  bottomToolbar: false,
  removeScroller: true,
  hideSidebar: false,
  battleTrans: true,
  localHash: '',
  transJa: true,
  transEn: true,
  keepBgm: false,
  originText: false,
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
  const keys = [
    'autoDownload', 'bottomToolbar', 'displayName', 'removeScroller', 'hideSidebar', 'originText',
    'transJa', 'transEn', 'keepBgm', 'font', 'transApi', 'fontBold', 'plainText', 'battleTrans'
  ]
  keys.forEach(key => {
    let value = setting[key]
    if (isString(value)) value = filter(value.trim())
    if (isBoolean(value) || value) {
      config[key] = value
    }
    if (key === 'transApi' && value === 'caiyun') {
      config[key] = 'baidu'
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
