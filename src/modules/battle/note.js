import isArray from 'lodash/isArray'
import isObject from 'lodash/isObject'
import isString from 'lodash/isString'
import { trim } from '../../utils/'
import CONFIG from '../../config'
import { getBattleNoteQuest, getBattleNote } from '../../store/battle-note'

const questMap = new Map()
let battleQuestNoteMap
let battleNoteMap = new Map()
let rid = 0
const getQuestId = async (data, pathname) => {
  if (pathname.endsWith('start.json')) {
    if (data.quest_id) {
      let questId = parseInt(data.quest_id)
      questMap.set(data.raid_id, questId)
      battleQuestNoteMap = await getBattleNoteQuest(questId)
    }
    rid = data.raid_id
  }
}

const reList = [
  [/(Lv\d+\s)?(.+)が真の力を解放した！/, '$1$2释放了真正的力量！', { 2: 'name' }],
  [/(Lv\d+\s)?(.+)の特殊行動が発動！/, '$1$2的特殊行动发动了！', { 2: 'name' }],
  [/(Lv\d+\s)?(.+)が更なる力を覚醒させた！/, '$1$2唤醒了更强的力量！', { 2: 'name' }],
  [/(Lv\d+\s)?(.+)のCTがMAXになった。/, '$1$2的CT达到了MAX。', { 2: 'name' }],
  [/(.+)は麻痺していて動けない！/, '$1因麻痹效果无法行动！', { 1: 'name' }],
  [/(.+)の効果により(.+)が復活した！/, '因$1的效果$2复活了！', { 1: 'skill', 2: 'name' }]
]

let textList = []
const transNote = (item, key) => {
  if (!isObject(item)) return
  let text = trim(item[key])
  if (!text && !isString(text)) return
  text = text.replace(CONFIG.userName, '姬塔')
  text = text.replace(/\r?\n/g, '')
  if (battleNoteMap.has(text)) {
    let trans = battleNoteMap.get(text)
    trans = trans.replace('姬塔', CONFIG.displayName || CONFIG.userName)
    item[key] = trans
  } else if (questMap.has(rid) && battleQuestNoteMap && battleQuestNoteMap.has(text)) {
    let trans = battleQuestNoteMap.get(text)
    trans = trans.replace('姬塔', CONFIG.displayName || CONFIG.userName)
    item[key] = trans
  } else {

  }
  if (CONFIG.log && !textList.includes(text)) {
    textList.push(text)
  }
}

let win = window.unsafeWindow || window
win.printBattleNote = () => {
  let str = 'text,\n' + textList.join(',\n') + ','
  if (questMap.has(rid)) {
    str = `quest-${questMap.get(rid)}.note.csv\n\n${str}`
  }
  console.log(str)
}

const startData = (data) => {
  if (isArray(data.navi_information)) {
    data.navi_information.forEach(item => {
      transNote(item, 'text')
    })
  }
  if (!CONFIG.userName && isString(data.nickname)) {
    CONFIG.userName = data.nickname
    localStorage.setItem('blhxfy:name', data.nickname)
  }
  if (isObject(data.battle_condition)) {
    transNote(data.battle_condition, 'body')
  }
}

const normalData = (data) => {
  if (isArray(data.scenario)) {
    data.scenario.forEach(item => {
      if (item.cmd === 'battlelog') {
        if (isString(item.body)) {
          transNote(item, 'body')
          transNote(item, 'title')
        } else if (isObject(item.body)) {
          transNote(item.body, 'ja')
        } else if (isObject(item.title)) {
          transNote(item.title, 'ja')
        }
      } else if (item.cmd === 'navi_information') {
        if (isArray(item.details)) {
          item.details.forEach(detail => {
            transNote(detail, 'text')
          })
        }
      } else if (item.cmd === 'super') {
        transNote(item, 'name')
      } else if (item.cmd === 'line_message') {
        transNote(item, 'title')
        transNote(item, 'message')
      } else if (item.cmd === 'resurrection') {
        transNote(item, 'title')
        transNote(item, 'comment')
      }
    })
  }

  if (isArray(data.navi_information)) {
    data.navi_information.forEach(item => {
      transNote(item, 'text')
    })
  }
}

const battleNote = async (data, pathname) => {
  await getQuestId(data, pathname)
  battleNoteMap = await getBattleNote()
  if (pathname.endsWith('start.json')) {
    startData(data)
  } else {
    normalData(data)
  }
}

export default battleNote