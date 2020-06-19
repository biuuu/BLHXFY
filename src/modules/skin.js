import getSkinData from '../store/skin'
import getNameData from '../store/name-npc'
import transName from '../utils/trans-name'

export default async function transSkin(data, pathname) {
  const skinMap = await getSkinData()
  const { jpNameMap, enNameMap } = await getNameData()
  data.list.forEach(char => {
    char.name = transName(char.name, [jpNameMap, enNameMap])
    char.list_data.forEach(item => {
      const id = item.master.id
      if (skinMap.has(id)) {
        const data = skinMap.get(id)
        if (data.name) item.master.name = data.name
        if (data.comment) item.master.comment = data.comment
      }
    })
  })
  return data
}
