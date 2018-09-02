import config from '../config'

const getUserName = (data) => {
  const html = decodeURIComponent(data.data)
  const rgs = html.match(/<span\sclass="txt-user-name">([^<]+)<\/span>/)
  if (rgs && rgs[1]) {
    config.userName = rgs[1]
    localStorage.setItem('blhxfy:name', rgs[1])
  }
}

const getLocalName = () => {
  const name = localStorage.getItem('blhxfy:name')
  if (name) config.userName = name
}

getLocalName()

export default getUserName