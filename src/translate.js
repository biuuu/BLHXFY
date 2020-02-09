import URI from 'urijs'
import isString from 'lodash/isString'
import isRegExp from 'lodash/isRegExp'
import loginBonus from './modules/login-bonus'
import transScenario from './modules/scenario'
import transLangMsg from './modules/langMsg'
import transNpcSkill from './modules/skill-npc'
import transJobSkill from './modules/skill-job'
import transHTML from './modules/content-html'
import transTownInfo from './modules/town-info'
import transIslandInfo from './modules/island-info'
import transChat from './modules/chat-preset'
import transBattle, { transBattleR } from './modules/battle'
import weaponSkill from './modules/weapon'
import summonSkill from './modules/summon'
import transComic, { transComicT, transComicD } from './modules/comic'
import transBuff from './modules/buff'
import transArcarum from './modules/arcarum'
import pageIndex, { replaceHour, replaceHourU } from './modules/page-index'
import { showVoiceSubL } from './modules/voice-sub'
import { getUserName, setUserName } from './store/name-user'

const apiHosts = ['game.granbluefantasy.jp', 'gbf.game.mbga.jp']

const requestRouter = async (data, type, list) => {
  let result = false
  try {
    for (let [paths, handles] of list) {
      if (!Array.isArray(paths)) paths = [paths]
      let pass = false
      for (let path of paths) {
        if (isString(path) && type.includes(path)) {
          pass = true
        } else if (isRegExp(path) && path.test(type)) {
          pass = true
        }
      }
      if (pass) {
        result = true
        if (!Array.isArray(handles)) handles = [handles]
        for (let handle of handles) {
          if (isString(handle)) {
            
          } else {
            await handle(data, type)
          }
        }
      }
    }
  } catch (e) {
    console.log(e)
  }
  return result
}

const requestList = [
  ['/loginbonus/', loginBonus],
  ['scenario', [setUserName, transScenario]],
  ['/content/',[transLangMsg, transHTML, replaceHour]],
  ['/profile/content/index/', getUserName],
  ['/user/content/index', [transTownInfo, pageIndex]],
  ['/comic/content/episode/', transComic],
  ['/comic/content/index', transComicT],
  ['/comic/list/', transComicD],
  [['/npc/npc/', '/archive/npc_detail'], transNpcSkill],
  [['/party_ability_subaction/', '/party/job_equipped/', 
    '/party/ability_list/', '/zenith/ability_list/', '/party/job_info/'], transJobSkill],
  ['/island/init', transIslandInfo],
  [['/rest/sound/mypage_voice', '/rest/sound/archive_voice'], showVoiceSubL],
  [[/\/rest\/(multi)?raid\/start\.json/, /\/rest\/tutorial\/tutorial\d{1,2}\.json/], [transChat, transBattle]],
  [[/\/rest\/(multi)?raid\/ability_result\.json/,
    /\/rest\/(multi)?raid\/temporary_item_result\.json/,
    /\/rest\/(multi)?raid\/normal_attack_result\.json/,
    /\/rest\/(multi)?raid\/summon_result\.json/,
    /\/rest\/tutorial\/tutorial_battle_\d+_\d+\.json/], transBattleR],
  [/\/rest\/.*?raid\/condition\/\d+\/\d\/\d\.json/, transBuff],
  ['/user/status', replaceHourU],
  [['/weapon/weapon/', '/archive/weapon_detail'], weaponSkill],
  [['/summon/summon/', '/archive/summon_detail'], summonSkill],
  [['/rest/arcarum/move_division',
    '/rest/arcarum/start_stage',
    '/rest/arcarum/open_gatepost',
    '/rest/arcarum/open_chest',
    '/rest/arcarum/next_stage',
    '/rest/arcarum/stage'], transArcarum]
]

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
    let result = await requestRouter(data, pathname, requestList)
    if (!result) return
  } else {
    return
  }

  state.result = isJSON ? JSON.stringify(data) : data
}
