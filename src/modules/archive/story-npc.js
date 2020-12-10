import getNameData from '../../store/name-npc'
import getStoryNpc from '../../store/story-npc'
import transName from '../../utils/trans-name'

export default async function (data, pathname) {
  const { jpNameMap, enNameMap } = await getNameData()
  const storyNpc = await getStoryNpc()
  data.name = transName(data.name, [jpNameMap, enNameMap])
  if (storyNpc.has(data.id)) {
    data.comment = storyNpc.get(data.id)
  }
  return data
}
