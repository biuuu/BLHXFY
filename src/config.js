import { isDomain } from './utils/'
import isString from 'lodash/isString'
import isPlainObject from 'lodash/isPlainObject'
import filter from './utils/XSSFilter'

const config = {
  origin: 'https://blhx.danmu9.com',
  apiHosts: ['game.granbluefantasy.jp', 'gbf.game.mbga.jp'],
  hash: '',
  userName: '',
  displayName: '',
  timeout: 8,
  autoDownload: false,
  bottomToolbar: false
}

const getLocalConfig = () => {
  const str = localStorage.getItem('blhxfy:setting')
  let setting = JSON.parse(str)
  if (!isPlainObject(setting)) setting = {}
  const { origin } = setting
  if (isDomain(origin)) {
    config.origin = origin.trim()
  }
  const keys = ['autoDownload', 'bottomToolbar', 'displayName']
  keys.forEach(key => {
    let value = setting[key]
    if (isString(value)) value = filter(value.trim())
    if (value) {
      config[key] = value
    }
  })
}

getLocalConfig()

export default config
