import fetchData from '../fetch'
import parseCsv from '../utils/parseCsv'
import { getLocalData, setLocalData } from './local-data'
import filter from '../utils/XSSFilter'
import { trim } from '../utils/'

const battleNoteMap = new Map()
let loaded = false

const getBattleNote = async () => {
  if (!loaded) {
    let csv = await getLocalData('battle/battle-note')
    if (!csv) {
      csv = await fetchData('/blhxfy/data/battle/battle-note.csv')
      setLocalData('battle-note', csv)
    }
    const list = parseCsv(csv)
    list.forEach(item => {
      const text = trim(item.text)
      const trans = filter(item.trans)
      if (text && trans) {
        battleNoteMap.set(text, trans)
      }
    })
    loaded = true
  }

  return battleNoteMap
}

const battleNoteQuestMapId = {}
let questNote
const getBattleNoteQuest = async (id) => {
  if (battleNoteQuestMapId[id]) return battleNoteQuestMapId[id]
  if (!questNote) questNote = await getLocalData('battle-note-path')
  if (!questNote) {
    questNote = await fetchData('/blhxfy/data/battle-note.json')
    setLocalData('battle-note-path', questNote)
  }
  if (questNote[id]) {
    let questNoteData = getLocalData('battle-note-quest')
    if (!questNoteData || !questNoteData[id]) {
      let csv = await fetchData(`/blhxfy/data/battle/note/${questNote[id]}`)
      questNoteData = { [id]: csv }
      setLocalData('battle-note-quest', questNoteData)
    }
    const list = parseCsv(questNoteData[id])
    let battleNoteQuestMap = new Map()
    list.forEach(item => {
      const text = trim(item.text)
      const trans = filter(item.trans)
      if (text && trans) {
        battleNoteQuestMap.set(text, trans)
      }
    })
    battleNoteQuestMapId[id] = battleNoteQuestMap
    return battleNoteQuestMap
  }
}

export { getBattleNoteQuest, getBattleNote }