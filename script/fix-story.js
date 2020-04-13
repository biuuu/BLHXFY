const fse = require('fs-extra')
const glob = require('glob')
const CSV = require('papaparse')

const Glob = glob.Glob
glob.promise = function (pattern, options) {
  return new Promise(function (resolve, reject) {
    var g = new Glob(pattern, options)
    g.once('end', resolve)
    g.once('error', reject)
  })
}

const readCsv = async (csvPath, silence) => {
  try {
    const data = await new Promise((rev, rej) => {
      fse.readFile(csvPath, 'utf-8', (err, data) => {
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

const fixStory = (text) => {
  return text.replace(/ー/g, '').replace(/ちゃん/g, '').replace(/さん/g, '').replace(/\.{3}/g, '…').replace(/\.{2}/g, '…').replace(/\./g, '')
}

const start = async () => {
  console.log('story...')
  const files = await glob.promise('./data/scenario/**/*.csv')
  const prims = files.map(file => {
    return readCsv(file).then(list => {
      let replaced = false
      for (let i = list.length - 1; i >= 0; i--) {
        if (/^\d/.test(list[i].id)) {
          if (list[i].trans) {
            const text = list[i].trans.trim()
            if (text) {
              let _text = fixStory(text)
              if (_text !== text) {
                list[i].trans = _text
                replaced = true
              }
            }
          }
        }
      }
      if (replaced) {
        fse.writeFileSync(file, CSV.unparse(list)) 
      }
    })
  })
  await Promise.all(prims)
}

start()
