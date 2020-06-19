import getSkinData from '../store/skin'
import getNameData from '../store/name-npc'

export default async function transSkin(data, pathname) {
  const skinMap = await getSkinData()
  const { jpNameMap } = await getNameData()
  data.list.forEach(char => {
    if (jpNameMap.has(char.name)) char.name = jpNameMap.get(char.name).trans
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
