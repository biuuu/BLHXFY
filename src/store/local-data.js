import config from '../config'
import { getHash } from '../fetch'
import isString from 'lodash/isString'

let data = null

const getLocalData = async (type) => {
  // if (DEV) return false
  if (data) return data[type]
  try {
    const str = sessionStorage.getItem('blhxfy:data')
    if (!str) return false
    data = JSON.parse(str)
    const hash = await getHash()
    const newHash = hash[`${type}.csv`]
    const savedHash = data.hash[`${type}.csv`]
    if (!savedHash || savedHash === newHash) {
      return data[type]
    } else {
      data.hash[`${type}.csv`] = newHash
      return false
    }
  } catch (err) {
    console.error(err)
  }
  return false
}

const setLocalData = (type, value) => {
  // if (DEV) return false
  if (!data || isString(data.hash)) data = { hash: config.hash }
  let key = type
  if (!/(\.csv|\.json)/.test(type)) {
    key = `${type}.csv`
  }
  const newHash = config.hash[key]
  if (newHash) {
    data.hash[key] = newHash
  }
  data[type] = value
  const str = JSON.stringify(data)
  try {
    sessionStorage.setItem('blhxfy:data', str)
  } catch (err) {
    console.error(err)
  }
}

export { getLocalData, setLocalData }
