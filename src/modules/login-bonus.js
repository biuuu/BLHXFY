import getLoginBonus from '../store/login-bonus'

const loginBonus = async (data) => {
  let isReplay = data.isReplay
  if (isReplay) {
    data = localLoginBonus()
  }
  if (data.param && data.param.msgArray) {
    let loginBonusMap = await getLoginBonus()
    data.param.msgArray.forEach((txt, index) => {
      if (loginBonusMap.has(txt)) {
        data.param.msgArray[index] = loginBonusMap.get(txt)
      }
    })
    if (isReplay) {
      localLoginBonus(data)
    }
  }
}

const localLoginBonus = (data) => {
  try {
    if (data) {
      localStorage.setItem('login', JSON.stringify(data))
    } else {
      let str = localStorage.getItem('login')
      if (str) {
        let data = JSON.parse(str)
        return data
      }
    }
  } catch (e) {

  }
}

localLoginBonus()

export default loginBonus