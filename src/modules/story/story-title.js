import fetchData from '../../fetch'

let nameMap
const getName = async () => {
  if (!nameMap) {
    const chapterName = await fetchData('/blhxfy/data/chapter-name.json')
    nameMap = new Map(chapterName)
    nameMap.set('エンディング', '终章')
    nameMap.set('オープニング', '序章')
  }
  return nameMap
}

const chapterList = async (data) => {
  let list = data.chapter_list
  if (!list) return
  let nameMap = await getName()
  list.forEach(item => {
    let name = item.chapter_name
    if (nameMap.has(name)) {
      item.chapter_name = nameMap.get(name)
    }
  })
}

const npcChapterList = async (data) => {
  let nameMap = await getName()
  if (data.scenes) {
    for (let key in data.scenes) {
      let item = data.scenes[key]
      let name = item.scene_name
      if (nameMap.has(name)) {
        item.scene_name = nameMap.get(name)
      }
    }
  }
  if (data.episode) {
    data.episode.forEach(item => {
      let name = item.chapter_name
      if (nameMap.has(name)) {
        item.chapter_name = nameMap.get(name)
      }
    })
  }
}

const arcarumSceneName = async (data) => {
  let nameMap = await getName()
  if (data.option.scenes) {
    data.option.scenes.forEach(item => {
      let name = item.scene_name
      if (nameMap.has(name)) {
        item.scene_name = nameMap.get(name)
      }
    })
  }
}

const episodeList = async (data) => {
  let nameMap = await getName()
  let name = data.chapter_name
  if (nameMap.has(name)) {
    data.chapter_name = nameMap.get(name)
  }
  for (let key in data.list) {
    let item = data.list[key]
    item.episode_name = item.episode_name.replace(/エピソード (\d+)/, '第 $1 节')
  }
}

export { chapterList, episodeList, npcChapterList, arcarumSceneName }