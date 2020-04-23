import isArray from 'lodash/isArray'
import isObject from 'lodash/isObject'
import isString from 'lodash/isString'
import { trim } from '../../utils/'
import CONFIG from '../../config'
import { bossNameMap } from '../battle'
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
  [/(Lv.+\s)?(.+)が真の力を解放した！/, '$1$2释放了真正的力量！', { 2: 'name' }],
  [/(Lv.+\s)?(.+)の特殊行動が発動！/, '$1$2的特殊行动发动了！', { 2: 'name' }],
  [/(Lv.+\s)?(.+)が更なる力を覚醒させた！/, '$1$2唤醒了更强的力量！', { 2: 'name' }],
  [/(Lv.+\s)?(.+)のCTがMAXになった。/, '$1$2的CT达到了MAX。', { 2: 'name' }],
  [/(Lv.+\s)?(.+)は麻痺していて動けない！/, '$1$2因麻痹效果无法行动！', { 2: 'name' }],
  [/>(.+)の効果により(.+)が復活した！/, '>因$1的效果$2复活了！', { 1: 'skill', 2: 'name' }],
  [/(.+)を喚べますよ！/, '现在可以召唤$1了！', { 1: 'name' }],
  [/(.+)召喚、いけます！/, '$1召唤，准备就绪！', { 1: 'name' }],
  [/(Lv.+\s)?(.+)は眠っていて動けない！/, '$1$2因睡眠效果无法行动！', { 2: 'name' }],
  [/(Lv.+\s)?(.+)は魅了されていて動けない！/, '$1$2因魅惑效果无法行动！', { 2: 'name' }]
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
    reList.forEach(reArr => {
      if (reArr[0].test(text)) {
        let trans = reArr[1]
        item[key] = text.replace(reArr[0], function (...arr) {
          for (let i = 1; i < arr.length - 2; i++) {
            if (reArr[2][i] === 'name' && bossNameMap.has(arr[i])) {
              trans = trans.replace(`$${i}`, bossNameMap.get(arr[i]))
            } else {
              trans = trans.replace(`$${i}`, arr[i] || '')
            }
          }
          trans = trans.replace('姬塔', CONFIG.displayName || CONFIG.userName)
          return trans
        })
      }
    })
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
  }
  normalData(data)
}

export default battleNote