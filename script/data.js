const fse = require('fs-extra')
const md5 = require('md5-file')
const { version } = require('../package.json')
const glob = require('glob')
const CSV = require('papaparse')
const path = require('path')
const pako = require('pako')

const cyweb_token = 't4d0s9zds4fw272poa11'

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

const collectStoryId = async () => {
  console.log('story...')
  const files = await glob.promise('./data/scenario/**/*.csv')
  const chapterName = []
  const titleSet = new Set()
  const result = []
  const prims = files.map(file => {
    return readCsv(file).then(list => {
      let rs
      for (let i = list.length - 1; i >= 0; i--) {
        if (list[i].id === 'info') {
          if (list[i].trans) {
            const name = list[i].trans.trim()
            if (name) {
              rs = md5(file).then(hash => {
                result.push([name, file.replace(/^\.\/data\/scenario\//, ''), hash.slice(0, 7)])
              }) 
            }
          }
        } else if (/\d-chapter_name/.test(list[i].id)) {
          if (list[i].trans) {
            const trans = list[i].trans.trim()
            let title = list[i].text || list[i].jp
            title = title.trim()
            if (!titleSet.has(title) && title && trans) {
              titleSet.add(title)
              chapterName.push([title, trans])
            }
          }
        }
      }
      return rs
    })
  })
  await Promise.all(prims)
  const storyData = {}
  const storyDataPast = {}
  result.forEach(item => {
    if (item && item[0] && item[1]) {
      storyData[item[0]] = {
        path: item[1],
        hash: item[2]
      }
      storyDataPast[item[0]] = item[1]
    }
  })
  let storyc = pako.deflate(JSON.stringify(storyData), { to: 'string' })
  let storyp = pako.deflate(JSON.stringify(storyDataPast), { to: 'string' })
  await fse.writeJson('./dist/blhxfy/data/story.json', storyp)
  await fse.writeJson('./dist/blhxfy/data/story-map.json', storyc)
  await fse.writeJSON('./dist/blhxfy/data/chapter-name.json', chapterName)
}

const collectSkillId = async () => {
  console.log('skill...')
  const files = await glob.promise('./data/skill/**/*.csv')
  const prims = files.map(file => {
    return readCsv(file).then(list => {
      for (let i = 0; i < list.length; i++) {
        if (list[i].id === 'npc') {
          if (list[i].detail) {
            const id = list[i].detail.trim()
            if (id) {
              return md5(file).then(hash => {
                return [id, file.replace(/^\.\/data\/skill\//, ''), hash.slice(0, 7)]
              })
            }
          }
        }
      }
    })
  })
  const result = await Promise.all(prims)
  const skillData = {}
  const skillDataPast = {}
  result.forEach(item => {
    if (item && item[0] && item[1]) {
      skillData[item[0]] = {
        path: item[1],
        hash: item[2]
      }
      skillDataPast[item[0]] = item[1]
    }
  })
  await fse.writeJSON('./dist/blhxfy/data/skill.json', skillDataPast)
  await fse.writeJSON('./dist/blhxfy/data/skill-map.json', skillData)
}

const collectBattleNoteId = async () => {
  console.log('battle note...')
  const files = await glob.promise('./data/battle/note/**/*.note.csv')
  const prims = files.map(file => {
    let rgs = file.match(/quest-(\d+)\.note\.csv/)
    if (rgs && rgs[1]) {
      return md5(file).then(hash => {
        return [rgs[1], file.replace(/^\.\/data\/battle\/note\//, ''), hash.slice(0, 7)]
      })
    }
  })
  const result = await Promise.all(prims)
  const battleNoteData = {}
  const battleNoteDataPast = {}
  result.forEach(item => {
    if (item && item[0] && item[1]) {
      battleNoteData[item[0]] = {
        path: item[1], hash: item[2]
      }
      battleNoteDataPast[item[0]] = item[1]
    }
  })
  await fse.writeJSON('./dist/blhxfy/data/battle-note.json', battleNoteDataPast)
  await fse.writeJSON('./dist/blhxfy/data/battle-note-map.json', battleNoteData)
}

const collectVoice = async () => {
  console.log('voice...')
  const files = await glob.promise('{./data/scenario/**/voice.csv,./data/voice.csv}')
  let voiceList = []
  const prims = files.map(file => {
    return readCsv(file).then(list => {
      voiceList = voiceList.concat(list.filter(item => item.path))
    })
  })
  await Promise.all(prims)
  const csv = CSV.unparse(voiceList)
  await fse.outputFile('./dist/blhxfy/data/voice-mypage.csv', csv)
  await fse.outputFile('./dist/blhxfy/data/voice.csv', csv)
}

const getDate = (offset = 0) => {
  const dt = new Date(Date.now() + (offset * 60 * 60 * 1000))
  const year = dt.getUTCFullYear()
  const month = dt.getUTCMonth() + 1
  const date = dt.getUTCDate()
  const h = dt.getUTCHours()
  const m = dt.getUTCMinutes()
  const sec = dt.getUTCSeconds()
  const msec = dt.getUTCMilliseconds()
  return `${year}/${month}/${date} ${h}:${m}:${sec}.${msec}`
}

const md5File = async () => {
  const files = await glob.promise('{battle/*,*}.{csv,json}', {
    nodir: true, cwd: path.resolve(process.cwd(), './dist/blhxfy/data/') 
  })
  const data = {}
  const prms = files.map(file => {
    return md5(path.resolve(process.cwd(), './dist/blhxfy/data/', file)).then(hash => {
      data[file] = hash.slice(0, 7)
    })
  })
  await Promise.all(prms)
  return data
}

const start = async () => {
  await fse.emptyDir('./dist/blhxfy/data/')
  const hash = version
  console.log(hash)
  const date = getDate(8)

  console.log('move data files...')
  await fse.copy('./data/', './dist/blhxfy/data/')

  console.log('move etc...')
  const etcFiles = await glob.promise('./dist/blhxfy/data/etc/**/*.csv')
  for (let file of etcFiles) {
    const name = path.basename(file)
    await fse.move(file, `./dist/blhxfy/data/${name}`)
  }

  console.log('move iframe...')
  await fse.copy('./src/lacia.html', './dist/blhxfy/lacia.html')

  await collectBattleNoteId()

  await collectStoryId()

  await collectSkillId()

  await collectVoice()

  const hashes = await md5File()

  await fse.writeJSON('./dist/blhxfy/manifest.json', { hash, version, date, hashes, cyweb_token })
}

start()
