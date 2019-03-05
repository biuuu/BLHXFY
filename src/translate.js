import URI from 'urijs'
import transScenario from './modules/scenario'
import transLangMsg from './modules/langMsg'
import transNpcSkill from './modules/skill-npc'
import transJobSkill from './modules/skill-job'
import transHTML from './modules/content-html'
import transTownInfo from './modules/town-info'
import transIslandInfo from './modules/island-info'
import transChat from './modules/chat-preset'
import transBattle from './modules/battle'
import weaponSkill from './modules/weapon'
import summonSkill from './modules/summon'
import transBuff from './modules/buff'
import pageIndex, { replaceHour } from './modules/page-index'
import showVoiceSub from './modules/voice-sub'
import { getUserName, setUserName } from './store/name-user'

const apiHosts = ['game.granbluefantasy.jp', 'gbf.game.mbga.jp']
const voiceHosts = ['game-a5.granbluefantasy.jp', 'gbf.game-a5.mbga.jp']

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
  if (apiHosts.indexOf(hostname) !== -1) {
    if (pathname.includes('scenario')) {
      setUserName()
      data = await transScenario(data, pathname)
    } else if (pathname.includes('/content/')) {
      try {
        if (pathname.includes('/profile/content/index/')) {
          getUserName(data)
        }
        data = await transLangMsg(data, pathname)
        if (pathname.includes('/user/content/index')) {
          data = await transTownInfo(data, pathname)
          data = await pageIndex(data, pathname)
        } else {
          data = replaceHour(data)
        }
      } catch (err) {
        console.error(err)
      }
      data = await transHTML(data, pathname)
    } else if (pathname.includes('/npc/npc/') || pathname.includes('/archive/npc_detail')) {
      data = await transNpcSkill(data, pathname)
    } else if (
      pathname.includes('/party_ability_subaction/') ||
      pathname.includes('/party/job/') ||
      pathname.includes('/party/ability_list/') ||
      pathname.includes('/zenith/ability_list/') ||
      pathname.includes('/party/job_info/')) {
      data = await transJobSkill(data, pathname)
    } else if (pathname.includes('/island/init')) {
      data = await transIslandInfo(data, pathname)
    } else if (pathname.includes('/rest/sound/mypage_voice')) {
      await showVoiceSub(data, pathname, 'list')
    } else if (/\/rest\/(multi)?raid\/start\.json/.test(pathname)) {
      data = await transChat(data)
      data = await transBattle(data)
    } else if (
      /\/rest\/(multi)?raid\/ability_result\.json/.test(pathname)
      || /\/rest\/(multi)?raid\/temporary_item_result\.json/.test(pathname)
      || /\/rest\/(multi)?raid\/normal_attack_result\.json/.test(pathname)
      || /\/rest\/(multi)?raid\/summon_result\.json/.test(pathname)
    ) {
      data = await transBattle(data, 'result')
    } else if (/\/rest\/.*?raid\/condition\/\d+\/\d\/\d\.json/.test(pathname)) {
      await transBuff(data.condition)
    } else if (pathname.includes('/user/status')) {
      data = replaceHour(data, 'user')
    } else if (
      pathname.includes('/weapon/weapon/') ||
      pathname.includes('/archive/weapon_detail')
    ) {
      data = await weaponSkill(data)
    } else if (
      pathname.includes('/summon/summon/') ||
      pathname.includes('/archive/summon_detail')
    ) {
      data = await summonSkill(data)
    } else {
      return
    }
  } else {
    return
  }

  state.result = isJSON ? JSON.stringify(data) : data
}
