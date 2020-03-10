import replaceTurn from '../utils/replaceTurn'
import getBuffData from '../store/buff'

const transBuff = async (obj) => {
  if (!obj || !obj.condition) return
  let data = obj.condition
  const keys = ['buff', 'debuff']
  for (let key of keys) {
    if (data[key]) {
      const buffMap = await getBuffData(key)
      for (let k in data[key]) {
        const item = data[key][k]
        if (item.detail && buffMap.has(item.detail)) {
          item.detail = buffMap.get(item.detail)
        }
        if (item.effect) item.effect = replaceTurn(item.effect)
      }
    }
  }
}

export default transBuff
