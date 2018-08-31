import fetch from './fetch'
import URI from 'urijs'
import transScenario from './modules/scenario'

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
  console.log(pathname, hostname, hash)
  if (apiHosts.indexOf(hostname) === -1) return
  if (pathname.includes('scenario')) {
    result = transScenario(data)
  }
  state.result = isJSON ? JSON.stringify(result) : result
}
