const users = require('../../store/users')

const getUserInfo = (body) => {
  const uidRst = body.match(/Game\.userId\s*=\s*(\d+)/)
  const langRst = body.match(/Game\.lang\s*=\s*'(\w+)'/)
  if (uidRst && uidRst[1]) {
    const info = users.get(uidRst[1]) || {}
    info.lang = langRst[1]
    if (info.lang === 'ja') info.lang = 'jp'
    users.set(uidRst[1], info)
  }
}

const getUserName = (responseDetail, uid, from) => {
  const body = responseDetail.response.body.toString()
  const data = JSON.parse(body)
  if (data.option) {
    const html = decodeURIComponent(data.data)
    const nameRst = html.match(/current_name="([^"]+)"/)
    if (nameRst && nameRst[1] && uid) {
      const info = users.get(uid) || {}
      info.name = nameRst[1]
      users.set(uid, info)
    }
    if (from === 'btn_se') {
      responseDetail.response.body = '{"data":{"se001":"se\/btn_se\/btn_se_01.mp3","se002":"se\/btn_se\/btn_se_02.mp3","se003":"se\/btn_se\/btn_se_03.mp3","se004":"se\/btn_se\/btn_se_04.mp3","se005":"se\/btn_se\/btn_se_05.mp3","queststart":"se\/queststart_se_1.mp3","target":"se\/target_se_1.mp3","bookopen":"se\/book_open_se_1.mp3","stamp":"se\/stamp_se_1.mp3","menuopen":"se\/menu_open_se_1.mp3","menuclose":"se\/menu_close_se_1.mp3"}}'
    }
  }
  
  return responseDetail
}

module.exports = {
  getUserInfo,
  getUserName
}