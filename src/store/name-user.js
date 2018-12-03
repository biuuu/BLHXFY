import config from '../config'
import filter from '../utils/XSSFilter'

const getUserName = (data) => {
  const html = decodeURIComponent(data.data)
  const rgs = html.match(/<span\sclass="txt-user-name">([^<]+)<\/span>/)
  if (rgs && rgs[1]) {
    config.userName = rgs[1]
    localStorage.setItem('blhxfy:name', rgs[1])
  }
}

const setUserName = () => {
  if (!config.userName && Game.userId) {
    require(['model/content'], function(mc) {
      let req = new mc({
          controller: "profile",
          action: "index",
          param: {
            user_id: Game.userId
          }
      })
      req.fetch()
    })
    config.userName = '古兰'
    localStorage.setItem('blhxfy:name', config.userName)
  }
}

const getLocalName = () => {
  const name = localStorage.getItem('blhxfy:name')
  if (name) config.userName = filter(name)
}

getLocalName()

export { getUserName, setUserName }
