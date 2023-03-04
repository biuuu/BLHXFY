import request from './request'
import { fetchInfo, getHash } from '../fetch'
import x64hash128 from './x64hash128'

let bid = ''
let uid = ''
let pid = location.host === 'gbf.game.mbga.jp' ? 1369959 : 89607
let limited = false

const setBid = () => {
  let str = '0123456789abcdefghijklmnopqrstuvwxyz'
  let text = ''
  for (let i = 0; i < 33; i++) {
    text += str[Math.floor(Math.random() * str.length)]
  }
  bid = x64hash128(text, 31)
  localStorage.setItem('blhxfy:bid', bid)
}

try {
  bid = localStorage.getItem('blhxfy:bid')
} catch (e) {}

if (!bid) {
  setBid()
}

const testCookies = async () => {
  await getHash()
  const res = await request('https://biz.caiyunapp.com/test_cookies', {
    cors: true,
    credentials: 'include',
    headers: {
      'X-Authorization': `token ${fetchInfo.data.cyweb_token}`
    }
  })
  if (res.status === 'ok' && res.cookies.cy_user) {
    const data =  JSON.parse(decodeURIComponent(res.cookies.cy_user))
    uid = data._id || defaultUid
  } else {
    return false
  }
}

const getAuth = async () => {
  const res = await request('https://api.interpreter.caiyunai.com/v1/page/auth', {
    // cors: true,
    method: 'POST',
    headers: {
      'X-Authorization': `token ${fetchInfo.data.cyweb_token}`,
      'Content-Type': 'application/json',
      'origin': 'https://fanyi.caiyunapp.com',
      'referer': 'https://fanyi.caiyunapp.com/'
    },
    data: JSON.stringify({
      browser_id: bid,
      device_id: '',
      os_type: 'web',
      title: 'グランブルーファンタジー',
      url: document.URL,
      user_id: uid
    })
  })
  if (res.auth_type === -1 || !res.page_id) {
    limited = true
    setBid()
  } else {
    pid = res.page_id
  }
}

const translator = async (list, from = 'ja') => {
  // await getAuth()
  const res = await request('https://api.interpreter.caiyunai.com/v1/page/translator', {
    cors: true,
    method: 'POST',
    headers: {
      'X-Authorization': `token ${fetchInfo.data.cyweb_token}`,
      'Content-Type': 'application/json'
    },
    data: JSON.stringify({
      cached: true,
      os_type: 'web',
      page_id: pid,
      replaced: true,
      request_id: bid,
      source: list,
      trans_type: `${from}2zh`,
      url: document.URL
    })
  })
  if (res && res.target) {
    return res.target.map(item => item.target)
  } else if (res.rc) {
    return ['caiyunoutoflimit']
  }
  return []
}

export default translator