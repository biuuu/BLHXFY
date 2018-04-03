const { readCsv, writeCsv } = require('../../utils/')
const baiduTrans = require('../../api/baidu')
const phraseMap = require('../../store/phraseMap')
const CSV = require('papaparse')
const fs = require('fs')
const path = require('path')

const LANG_MSG_PATH = path.resolve(__dirname, '../../data', 'lang-msg.csv')

const getData = async (data) => {
  const list = await readCsv(LANG_MSG_PATH)
  const ids = list.map(item => {
    return item.msgid
  })
  let obj = data.option.langMsg
  const keys = Object.keys(obj)
  const values = Object.values(obj)
  let rr = []
  let prmis = []
  for (let [key, value] of Object.entries(obj)) {
    if (!value.msg.trim()) continue
    const index = ids.indexOf(key)
    if (index !== -1) {

    } else {
      prmis.push({
        prmi: baiduTrans(value.msg),
        msgid: key,
        msgen: value.msg,
      })
      console.log(key)
    }
  }
  if (prmis.length) {
    const translist = await Promise.all(prmis.map(item => item.prmi))
    translist.forEach((trans, index) => {
      list.push({
        msgid: prmis[index].msgid,
        msgen: prmis[index].msgen,
        trans,
      })
    })

    writeCsv(LANG_MSG_PATH, list.sort((prev, next) => {
      if (prev.msgid > next.msgid) {
        return 1
      }
      return -1
    }))
  }
  
  return data
}

const parseData = async (data) => {
  if (!data.option || !data.option.langMsg) return data
  let obj = await getData(data)
  const msgs = obj.option.langMsg
  for (let key of Object.keys(msgs)) {
    const trans = phraseMap.get(key)
    if (trans) {
      msgs[key].msg = trans
    }
  }
  return obj
}

module.exports = parseData