import getNameData from '../../store/name-npc'
import transName from '../../utils/trans-name'

export default async function archiveCharName(data, pathname) {
  const { jpNameMap, enNameMap } = await getNameData()
  for (let key in data.npc_list) {
    let item = data.npc_list[key]
    item.name = transName(item.name, [jpNameMap, enNameMap])
  }
  return data
}
