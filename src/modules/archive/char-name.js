import getNameData from '../../store/name-npc'
import transName from '../../utils/trans-name'

export default async function archiveCharName(data, pathname) {
  const { jpNameMap, enNameMap } = await getNameData()

  data.npc_list.forEach(item => {
    item.name = transName(item.name, [jpNameMap, enNameMap])
  })
  return data
}
