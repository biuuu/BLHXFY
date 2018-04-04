const CSV = require('papaparse')
const fs = require('fs')
const path = require('path')
const { readCsv } = require('../utils/')

const LANG_MSG_PATH = path.resolve(__dirname, '../data', 'lang-msg.csv')

const phraseMap = new Map()

readCsv(LANG_MSG_PATH).then(list => {
  // const list = CSV.parse(str, { header: true }).data
  list.forEach(item => {
    phraseMap.set(item.msgid, item.trans)
  })
})

module.exports = phraseMap