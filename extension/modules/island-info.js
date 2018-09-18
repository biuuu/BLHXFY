import getIslandData from '../store/island-info'

export default async function transIslandInfo(data, pathname) {
  let island
  try {
    island = data.island_info
  } catch (err) {
    return data
  }
  const islandMap = await getIslandData()
  if (islandMap.has(island.island_name)) {
    island.island_name = islandMap.get(island.island_name)
  }
  for (let key in island) {
    let item = island[key]
    let id = key
    if (islandMap.has(id)) {
      if (id !== 'island_name') {
        const data = islandMap.get(id)
        item.name = data.name
        item.area_comment = data.detail
      }
    }
  }
  return data
}
