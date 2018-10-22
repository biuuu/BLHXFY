import getTownData from '../store/town-info'

export default async function transTownInfo(data, pathname) {
  let town
  try {
    town = data.option.mydata_assets.mydata.town
  } catch (err) {
    return data
  }
  const townMap = await getTownData()
  if (townMap.has(town.location_id)) {
    town.town_name = townMap.get(town.location_id).name
  }
  for (let key in town.spot) {
    let item = town.spot[key]
    let id = `${town.location_id}-${item.id}`
    if (townMap.has(id)) {
      let data = townMap.get(id)
      item.location = data.name
      item.description = data.detail
      item.bee_comment = data.vyrn
    }
  }
  return data
}
