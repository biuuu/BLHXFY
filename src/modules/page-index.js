import getPhrase from '../store/phrase'

const replaceTime = (str) => {
  if (!str) return str
  return str.replace('時間', '小时')
}

const pageIndex = async (data) => {
  let messages
  let mydata
  let status
  try {
    mydata = data.option.mydata_assets.mydata
    messages = mydata.mypage_notification_list
    status = mydata.status
  } catch (err) {
    return data
  }
  if (messages.length) {
    const newMessages = []
    const phraseMap = await getPhrase()
    messages.forEach(item => {
      if (phraseMap.has(item.text)) {
        item.text = phraseMap.get(item.text)
      }
      if (item.url !== 'news/detail/1/20002') {
        newMessages.push(item)
      }
    })
    mydata.mypage_notification_list = newMessages
  }
  status.action_point_remain = replaceTime(status.action_point_remain)
  status.battle_point_remain = replaceTime(status.battle_point_remain)
  return data
}

const replaceHour = (data, type) => {
  if (!data.status && (!data.option || !data.option.user_status)) {
    return data
  }
  let status
  try {
    if (type === 'user') {
      status = data.status
    } else {
      status = data.option.user_status
    }
  } catch (e) {
    return data
  }
  if (status) {
    if (status.action_point_remain) status.action_point_remain = replaceTime(status.action_point_remain)
    if (status.battle_point_remain) status.battle_point_remain = replaceTime(status.battle_point_remain)
  }
  return data
}

const replaceHourU = (data) => {
  return replaceHour(data, 'user')
}

export default pageIndex
export { replaceHour, replaceHourU }
