import config from '../config'

let data = null

const getLocalData = (type) => {
  if (data) return data[type]
  try {
    const str = sessionStorage.getItem('blhxfy:data')
    if (!str) return false
    data = JSON.parse(str)
    if (data.hash !== config.hash) {
      data = null
      sessionStorage.removeItem('blhxfy:data')
      localStorage.removeItem('blhxfy:data')
      return false
    }
    return data[type]
  } catch (err) {
    console.error(err)
  }
  return false
}

const setLocalData = (type, value) => {
  if (!data) data = { hash: config.hash }
  data[type] = value
  const str = JSON.stringify(data)
  try {
    sessionStorage.setItem('blhxfy:data', str)
  } catch (err) {
    console.error(err)
  }
}

export { getLocalData, setLocalData }
