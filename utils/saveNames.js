const path = require('path')
const { writeCsv, readCsv, sortByStr } = require('./index')

const saveNames = async (names, lang) => {
  if (!lang) return
  const FILE_PATH = path.resolve(process.cwd(), 'local/', `npc-name-${lang}.csv`)
  let list = []
  try {
    list = await readCsv(FILE_PATH)
  } catch (err) {
    if (err.code !== 'ENOENT') {
      return
    }
  }
  const nameList = list.map(item => item.name)
  names.forEach(name => {
    if (!nameList.includes(name)) {
      list.push({
        name,
        trans: ''
      })
    }
  })
  list = sortByStr(list, 'name')
  await writeCsv(FILE_PATH, list)
}

module.exports = saveNames