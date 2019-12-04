import config from '../config'
import { getHash } from '../fetch'

let data = null

const getLocalData = async (type) => {
  if (DEV) return false
  if (data) return data[type]
  const hash = await getHash
  try {
    const str = sessionStorage.getItem('blhxfy:data')
    if (!str) return false
    data = JSON.parse(str)
    if (data.hash !== hash) {
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
  if (DEV) return false
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
