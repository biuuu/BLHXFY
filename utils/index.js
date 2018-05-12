const fs = require('fs-extra')
const { dirname } = require('path')
const mkdirp = require('mkdirp')
const CSV = require('papaparse')
const { LOCAL_CONFIG_PATH } = require('../store/')

const removeHtmlTag = (str) => {
  if (!/<[^>]{1,10}>/.test(str)) return str
  return str.replace(/<br\s?\/?>/g, '').replace(/<(\w{1,7})[^>]*>([^<]*)<\/\1>/g, '$2')
}

const replaceWords = (str, map, lang = 'en') => {
  if (!str) return str
  let _str = str
  for (let [key, val] of map) {
    const expr = key.replace(/\?/g, '\\?').replace(/\./g, '\\.').replace(/\*/g, '\\*').replace(/\+/g, '\\+')
    const reStr = lang === 'en' ? `\\b${expr}\\b` : `${expr}`
    if (typeof val === 'string') {
      _str = _str.replace(new RegExp(reStr, 'g'), val)
    } else if (val) {
      if (val.ignoreCase) {
        _str = _str.replace(new RegExp(reStr, 'gi'), val.trans)
      } else {
        _str = _str.replace(new RegExp(reStr, 'g'), val.trans)
      }
    }
  }
  return _str
}

const processResponseBody = async (params) => {
  const { res, handler, isJson, uid, pathname } = params
  const body = res.response.body.toString()
  const data = isJson ? JSON.parse(body) : body
  const newData = await handler(data, uid, pathname)
  const newBody = Buffer.from(isJson ? JSON.stringify(newData) : newData)
  res.response.body = newBody
  return res
}

const readCsv = async (csvPath, silence) => {
  try {
    const data = await new Promise((rev, rej) => {
      fs.readFile(csvPath, 'utf-8', (err, data) => {
        if (err) rej(err)
        rev(data)
      })
    })
    return CSV.parse(data.replace(/^\ufeff/, ''), { header: true }).data
  } catch (err) {
    if (!silence) {
      console.error(`读取csv失败：${err.message}\n${err.stack}`)
    }
    return []
  }
}

const readJson = async (filePath) => {
  let data = null
  try {
    const str = await new Promise((rev, rej) => {
      fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) rej(err)
        rev(data)
      })
    })
    data = JSON.parse(str)
  } catch (err) {
    console.error(`读取json失败：${err.message}\n${err.stack}`)
  }
  return data
}

const writeFile = async (filePath, data, utf8bom = true) => {
  return new Promise((rev, rej) => {
    mkdirp(dirname(filePath), function (err) {
      if (err) return rej(err)

      fs.writeFile(filePath, (utf8bom ? '\ufeff' : '') + data, (e) => {
        if (e) rej(e)
        rev()
      })
    })
  })
}

const writeCsv = async (csvPath, list) => {
  const content = CSV.unparse(list)
  await writeFile(csvPath, content)
}

const sortKeywords = (list, key = 'name') => {
  return list.sort((prev, next) => {
    if (next[key] === prev[key]) {
      return 0
    } else if (next[key].includes(prev[key])) {
      return 1
    } else {
      return -1
    }
  })
}

const sortByStr = (list, key = 'name') => {
  return list.sort((prev, next) => {
    if (prev[key] > next[key]) return -1
    else if (prev[key] < next[key]) return 1
    else return 0
  })
}

const saveConfig = (config) => {
  fs.writeJsonSync(LOCAL_CONFIG_PATH, config, { spaces: 2 })
}

module.exports = {
  removeHtmlTag,
  replaceWords,
  processResponseBody,
  writeFile, readJson,
  readCsv, writeCsv, sortKeywords, sortByStr,
  saveConfig
}
