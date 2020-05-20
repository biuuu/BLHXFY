import config from '../config'
import { getHash } from '../fetch'
import isString from 'lodash/isString'

let data = null

const getLocalData = async (type) => {
  // if (DEV) return false
  if (!data) {
    try {
      const str = sessionStorage.getItem('blhxfy:data')
      if (!str) return false
      data = JSON.parse(str)
    } catch (err) {
      console.error(err)
    }
  }
  let key = type
  if (!/(\.csv|\.json)/.test(type)) {
    key = `${type}.csv`
  }
  const hash = await getHash()
  const newHash = hash[key]
  const savedHash = data.hash[key]
  if (!savedHash || savedHash === newHash) {
    return data[type]
  } else {
    data.hash[key] = newHash
    return false
  }
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
