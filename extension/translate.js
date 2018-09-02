import URI from 'urijs'
import transScenario from './modules/scenario'
import getUserName from './store/name-user'

const apiHosts = ['game.granbluefantasy.jp', 'gbf.game.mbga.jp']

export default async function translate(state) {
  const uri = URI(state.url)
  const pathname = uri.pathname()
  const hostname = uri.hostname()
  let data = state.result
  let isJSON = true
  try {
    data = JSON.parse(data)
  } catch (err) {
    isJSON = false
  }
  if (apiHosts.indexOf(hostname) === -1) return
  if (pathname.includes('scenario')) {
    data = await transScenario(data, pathname)
  } else if (pathname.includes('/profile/content/index/')) {
    getUserName(data)
  } else {
    return
  }
  state.result = isJSON ? JSON.stringify(data) : data
}
