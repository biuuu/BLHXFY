const fse = require('fs-extra')
const md5Dir = require('md5-dir/promise')
const { version } = require('../package.json')
const glob = require('glob')
const CSV = require('papaparse')
const path = require('path')
const pako = require('pako')

const bdsign = {
  token: 'd0a372e3e02871d51c42606a18702e2b',
  gtk: '320305.131321201'
}

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
  const prims = files.map(file => {
    return readCsv(file).then(list => {
      let rs = []
      for (let i = list.length - 1; i >= 0; i--) {
        if (list[i].id === 'info') {
          if (list[i].trans) {
            const name = list[i].trans.trim()
            if (name) {
              rs = [name, file.replace(/^\.\/data\/scenario\//, '')]
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
  const result = await Promise.all(prims)
  const storyData = {}
  result.forEach(item => {
    if (item && item[0] && item[1]) {
      storyData[item[0]] = item[1]
    }
  })
  let storyc = pako.deflate(JSON.stringify(storyData), { to: 'string' })
  await fse.writeJson('./dist/blhxfy/data/story.json', storyc)
  await fse.writeJSON('./dist/blhxfy/data/scenario.json', storyData)
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
              return [id, file.replace(/^\.\/data\/skill\//, '')]
            }
          }
        }
      }
    })
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
  const files = await glob.promise('./data/battle/note/**/*.note.csv')
  const prims = files.map(file => {
    let rgs = file.match(/quest-(\d+)\.note\.csv/)
    if (rgs && rgs[1]) return [rgs[1], file.replace(/^\.\/data\/battle\/note\//, '')]
  })
  const result = await Promise.all(prims)
  const battleNoteData = {}
  result.forEach(item => {
    if (item && item[0] && item[1]) {
      battleNoteData[item[0]] = item[1]
    }
  })
  await fse.writeJSON('./dist/blhxfy/data/battle-note.json', battleNoteData)
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

const start = async () => {
  await fse.emptyDir('./dist/blhxfy/data/')
  const hash = await md5Dir('./data/')
  console.log(hash)
  await fse.writeJSON('./dist/blhxfy/manifest.json', { hash, version, bdsign, cyweb_token })

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
}

start()
