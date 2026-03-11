const fse = require('fs-extra')
const md5 = require('md5-file')
const { version } = require('../package.json')
const { glob } = require('glob')
const CSV = require('papaparse')
const path = require('path')
const pako = require('pako')

const cyweb_token = 'qgemv4jr1y38jyq6vhvi'

// 简单的并发限制实现，防止 EMFILE 错误
const pLimit = (limit) => {
  const queue = []
  let activeCount = 0
  const next = () => {
    activeCount--
    if (queue.length > 0) queue.shift()()
  }
  return (fn) => new Promise((resolve, reject) => {
    const run = () => {
      activeCount++
      fn().then(resolve).catch(reject).finally(next)
    }
    if (activeCount < limit) run()
    else queue.push(run)
  })
}

const limit = pLimit(100) // 限制同时打开 100 个文件

// 缓存 MD5 以减少重复计算
const md5Cache = new Map()
const getMd5 = async (file) => {
  if (md5Cache.has(file)) return md5Cache.get(file)
  const hash = (await md5(file)).slice(0, 7)
  md5Cache.set(file, hash)
  return hash
}

const readCsv = async (csvPath, silence) => {
  try {
    const data = await fse.readFile(csvPath, 'utf-8')
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
    await fse.writeFile(csvPath, text)
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
  
  const prims = files.map(file => limit(async () => {
    const [list, csvHash] = await Promise.all([
      readCsv(file),
      getMd5(file)
    ])

    const shortList = []
    shortList.push({
      id: 'filename',
      trans: path.basename(file, '.csv')
    })

    let infoLoaded = false
    for (let i = list.length - 1; i >= 0; i--) {
      const row = list[i]
      if (row.id && row.trans && row.id !== '译者') {
        shortList.push({
          id: row.id,
          trans: row.trans
        })
      }
      if (!infoLoaded && row.id === 'info') {
        if (row.trans) {
          const name = row.trans.trim()
          if (name) {
            result.push([name, file.replace(/^\.\/data\/scenario\//, ''), `${csvHash}.csv`])
            infoLoaded = true
          }
        }
      } else if (/\d-chapter_name/.test(row.id)) {
        if (row.trans) {
          const trans = row.trans.trim()
          let title = row.text || row.jp
          title = title.trim()
          if (!titleSet.has(title) && title && trans) {
            titleSet.add(title)
            chapterName.push([title, trans])
          }
        }
      } else if (row.id === '译者') {
        let arr = []
        for (let key in row) {
          if (key !== 'id' && row[key]) {
            arr.push(row[key])
          }
        }
        const translatorName = arr.join('-')
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
  }))
  
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
  await Promise.all([
    fse.writeJson('./dist/blhxfy/data/story.json', storyp),
    fse.writeJson('./dist/blhxfy/data/story-map.json', storyc),
    fse.writeJSON('./dist/blhxfy/data/chapter-name.json', chapterName)
  ])
}

const collectSkillId = async () => {
  console.log('skill...')
  await fse.ensureDir('./dist/blhxfy/data/skill/')
  const files = await glob('./data/skill/**/*.csv')
  const prims = files.map(file => limit(async () => {
    const list = await readCsv(file)
    for (let i = 0; i < list.length; i++) {
      if (list[i].id === 'npc') {
        if (list[i].detail) {
          const id = list[i].detail.trim()
          if (id) {
            const hash = await getMd5(file)
            await fse.copy(file, `./dist/blhxfy/data/skill/${hash}.csv`, {
              overwrite: false, errorOnExist: true
            })
            return [id, `${hash}.csv`]
          }
        }
      }
    }
  }))
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
  const files = await glob('./data/battle/note/**/*.note.csv') // 改为从源码读
  const prims = files.map(file => limit(async () => {
    let rgs = file.match(/quest-(\d+)\.note\.csv/)
    if (rgs && rgs[1]) {
      const hash = await getMd5(file)
      await fse.copy(file, `./dist/blhxfy/data/battle/${hash}.csv`) // 改为 copy
      return [rgs[1], hash]
    }
  }))
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
  const files = await glob('{./data/scenario/**/voice.csv,./data/voice.csv}')
  let voiceList = []
  const prims = files.map(file => limit(async () => {
    const list = await readCsv(file)
    voiceList = voiceList.concat(list.filter(item => item.path))
  }))
  await Promise.all(prims)
  const csv = CSV.unparse(voiceList)
  await Promise.all([
    fse.outputFile('./dist/blhxfy/data/voice-mypage.csv', csv),
    fse.outputFile('./dist/blhxfy/data/voice.csv', csv)
  ])
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
  const prms = files.map(file => limit(async () => {
    const fullPath = path.resolve(process.cwd(), './dist/blhxfy/data/', file)
    const hash = await getMd5(fullPath)
    data[file] = hash
  }))
  const cssMd5 = await getMd5('./dist/blhxfy/data/static/style/BLHXFY.css')
  data['BLHXFY.css'] = cssMd5
  await Promise.all(prms)
  return data
}

const start = async () => {
  await fse.emptyDir('./dist/blhxfy/data/')
  const hash = version
  console.log(hash)
  const date = getDate(8)

  console.log('move static files...')
  // 只复制静态资源和必要的子目录，跳过 scenario 这种巨大的处理目录
  await Promise.all([
    fse.copy('./data/static/', './dist/blhxfy/data/static/'),
    fse.copy('./src/lacia.html', './dist/blhxfy/lacia.html')
  ])

  console.log('move etc...')
  const etcFiles = await glob('./data/etc/**/*.csv')
  const rootCsvFiles = await glob('./data/*.csv')
  const battleFiles = await glob('./data/battle/*.csv')
  
  const moveFiles = [
    ...etcFiles.map(file => ({ file, dest: `./dist/blhxfy/data/${path.basename(file)}` })),
    ...rootCsvFiles.map(file => ({ file, dest: `./dist/blhxfy/data/${path.basename(file)}` })),
    ...battleFiles.map(file => ({ file, dest: `./dist/blhxfy/data/battle/${path.basename(file)}` }))
  ]

  await Promise.all(moveFiles.map(({ file, dest }) => limit(async () => {
    await fse.ensureDir(path.dirname(dest))
    return fse.copy(file, dest)
  })))

  // 并行执行所有的 collection 任务，全部从源码目录读取
  await Promise.all([
    collectBattleNoteId(),
    collectStoryId(),
    collectSkillId(),
    collectVoice()
  ])

  const hashes = await md5File()

  await fse.writeJSON('./dist/blhxfy/manifest.json', { hash, version, date, hashes, cyweb_token })

  if (process.env.CUSTOM_DOMAIN || process.env.GITHUB_ACTION) {
    await fse.outputFile('./dist/CNAME', 'blhx.danmu9.com')
  }
}

if (require.main === module) {
  start()
}

module.exports = { start }
