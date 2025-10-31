const fse = require('fs-extra')
const md5 = require('md5-file')
const { version } = require('../package.json')
const { glob } = require('glob')
const CSV = require('papaparse')
const path = require('path')
const pako = require('pako')

const cyweb_token = 'qgemv4jr1y38jyq6vhvi'

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

const writeCsv = async (csvPath, list) => {
  try {
    const text = CSV.unparse(list)
    await new Promise((rev, rej) => {
      fse.writeFile(csvPath, text, (err) => {
        if (err) rej(err)
        rev()
      })
    })
  } catch (err) {
    console.error(`写入csv失败：${err.message}\n${err.stack}`)
  }
}

const collectStoryId = async () => {
  console.log('story...')
  const files = await glob('./data/scenario/**/*.csv')
  const chapterName = []
  const titleSet = new Set()
  const result = []
  await fse.ensureDir('./dist/blhxfy/data/story/')
  const prims = files.map(async file => {
    const list = await readCsv(file)
    const shortList = []
    let translatorName = ''
    let csvHash = ''
    shortList.push({
      id: 'filename',
      trans: path.basename(file, '.csv')
    })
    for (let i = list.length - 1; i >= 0; i--) {
      let infoLoaded = false
      if (list[i].id && list[i].trans && list[i].id !== '译者') {
        shortList.push({
          id: list[i].id,
          trans: list[i].trans
        })
      }
      if (!infoLoaded && list[i].id === 'info') {
        if (list[i].trans) {
          const name = list[i].trans.trim()
          if (name) {
            try {
              csvHash = (await md5(file)).slice(0, 7)
              // await fse.copy(file, `./dist/blhxfy/data/story/${hash}.csv`, {
              //   overwrite: false, errorOnExist: true
              // })
              result.push([name, file.replace(/^\.\/data\/scenario\//, ''), `${csvHash}.csv`])
              infoLoaded = true
            } catch (e) {
              console.log(e.message)
            }
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
      } else if (list[i].id === '译者') {
        let arr = []
        for (let key in list[i]) {
          if (key !== 'id' && list[i][key]) {
            arr.push(list[i][key])
          }
        }
        translatorName = arr.join('-')
        if (translatorName) {
          shortList.push({
            id: 'translator',
            trans: translatorName
          })
        }
      }
    }
    if (csvHash) {
      await writeCsv(`./dist/blhxfy/data/story/${csvHash}.csv`, shortList)
    }
  })
  await Promise.all(prims)
  const storyData = {}
  const storyDataPast = {}
  result.forEach(item => {
    if (item && item[0] && item[1]) {
      storyData[item[0]] = item[2]
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
  await fse.emptyDir('./dist/blhxfy/data/skill/')
  const files = await glob('./data/skill/**/*.csv')
  const prims = files.map(async file => {
    const list = await readCsv(file)
    for (let i = 0; i < list.length; i++) {
      if (list[i].id === 'npc') {
        if (list[i].detail) {
          const id = list[i].detail.trim()
          if (id) {
            const hash = (await md5(file)).slice(0, 7)
            await fse.copy(file, `./dist/blhxfy/data/skill/${hash}.csv`, {
              overwrite: false, errorOnExist: true
            })
            return [id, `${hash}.csv`]
          }
        }
      }
    }
  })
  const result = await Promise.all(prims)
  const skillData = {}
  result.forEach(item => {
    if (item && item[0] && item[1]) {
      skillData[item[0]] = item[1]
    }
  })
  await fse.writeJSON('./dist/blhxfy/data/skill.json', skillData)
}

const collectBattleNoteId = async () => {
  console.log('battle note...')
  const files = await glob('./dist/blhxfy/data/battle/note/**/*.note.csv')
  const prims = files.map(async file => {
    let rgs = file.match(/quest-(\d+)\.note\.csv/)
    if (rgs && rgs[1]) {
      const hash = (await md5(file)).slice(0, 7)
      await fse.move(file, `./dist/blhxfy/data/battle/${hash}.csv`, {
        overwrite: false, errorOnExist: true
      })
      return [rgs[1], hash]
    }
  })
  const result = await Promise.all(prims)
  const battleNoteData = {}
  const battleNoteDataPast = {}
  result.forEach(item => {
    if (item && item[0] && item[1]) {
      battleNoteData[item[0]] = item[1]
    }
  })
  await fse.writeJSON('./dist/blhxfy/data/battle-note.json', battleNoteData)
}

const collectVoice = async () => {
  console.log('voice...')
  const files = await glob('{./data/scenario/**/voice.csv,./data/voice.csv}')
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
  const files = await glob('{battle/*,*}.{csv,json}', {
    nodir: true, cwd: path.resolve(process.cwd(), './dist/blhxfy/data/')
  })
  const data = {}
  const prms = files.map(file => {
    return md5(path.resolve(process.cwd(), './dist/blhxfy/data/', file)).then(hash => {
      data[file] = hash.slice(0, 7)
    })
  })
  const cssMd5 = await md5('./dist/blhxfy/data/static/style/BLHXFY.css')
  data['BLHXFY.css'] = cssMd5.slice(0, 7)
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
  const etcFiles = await glob('./dist/blhxfy/data/etc/**/*.csv')
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

  await fse.emptyDir('./dist/blhxfy/data/scenario/')
}

start()
