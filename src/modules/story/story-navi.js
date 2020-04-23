import CSV from 'papaparse/papaparse.min'
import CONFIG from '../../config'
import { tryDownload } from '../../utils'
import isArray from 'lodash/isArray'

let str = ''
const storyNavi = async (data) => {
  if (CONFIG.log && data && data.option && data.option.navi) {
    const naviData = data.option.navi
    const npc = naviData.npc_list
    const list = []
    for (let key in naviData.comment_list) {
      const synopsis = naviData.episode_status[key].synopsis
      list.push({
        name: `简介 ${key}`,
        text: synopsis,
        voice: '', image: ''
      })
      const commList = naviData.comment_list[key]
      for (let npcId in commList) {
        if (isArray(commList[npcId])) {
          const name = npc[npcId]
          commList[npcId].forEach((item, index) => {
            list.push({
              name: `${name}${index ? index : ''}`,
              text: item.text,
              voice: item.voice,
              image: item.img
            })
          })
        } else {
          const item = commList[npcId]
          list.push({
            name: item.npc_name,
            text: item.text,
            voice: item.voice,
            image: item.img
          })
        }
      }
    }
    str = CSV.unparse(list)
  }
}

let win = window.unsafeWindow || window
win.dlStoryNavi = () => {
  if (!CONFIG.log) return
  const date = new Date()
  tryDownload(str, `story-navi-${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}.csv`)
}

export default storyNavi