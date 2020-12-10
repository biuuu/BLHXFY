import URI from 'urijs'
import CONFIG from './config'
import isString from 'lodash/isString'
import isRegExp from 'lodash/isRegExp'
import loginBonus from './modules/login-bonus'
import transScenario from './modules/scenario'
import transLangMsg, { shopLabel } from './modules/phrase'
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
import { chapterList, episodeList, npcChapterList, arcarumSceneName } from './modules/story/story-title'
import battleNote from './modules/battle/note'
import storyNavi from './modules/story/story-navi'
import transSkin from './modules/skin'
import archiveCharName from './modules/archive/char-name'
import storyNpcDetail from './modules/archive/story-npc'

const apiHosts = ['game.granbluefantasy.jp', 'gbf.game.mbga.jp']

const requestRouter = async (data, type, list) => {
  let result = false
  for (let [paths, handles] of list) {
    if (!Array.isArray(paths)) paths = [paths]
    let pass = false
    for (let path of paths) {
      if (isString(path) && type.includes(path)) {
        if (!CONFIG.storyOnly || storyPath.includes(path)) {
          pass = true
        }
      } else if (isRegExp(path) && path.test(type)) {
        if (!CONFIG.storyOnly) pass = true
      }
    }
    if (pass) {
      result = true
      if (!Array.isArray(handles)) handles = [handles]
      for (let handle of handles) {
        try {
          if (isString(handle)) {

          } else {
            await handle(data, type)
          }
        } catch (e) {
          console.log(e)
        }
      }
    }
  }
  return result
}

const storyPath = ['scenario', '/profile/content/index/']
const requestList = [
  ['/loginbonus/', loginBonus],
  ['scenario', [setUserName, transScenario]],
  ['/profile/content/index/', getUserName],
  ['/content/',[transLangMsg, transHTML, replaceHour]],
  ['/user/content/index', [transTownInfo, pageIndex]],
  ['/comic/content/episode/', transComic],
  ['/comic/content/index', transComicT],
  ['/comic/list/', transComicD],
  [['/npc/npc/', '/archive/npc_detail'], transNpcSkill],
  [['/party_ability_subaction/', '/party/job_equipped/',
    '/party/ability_list/', '/zenith/ability_list/', '/party/job_info/'], transJobSkill],
  ['/island/init', transIslandInfo],
  [['/rest/sound/mypage_voice', '/rest/sound/archive_voice'], showVoiceSubL],
  [[/\/rest\/(multi)?raid\/start\.json/, /\/rest\/tutorial\/tutorial\d+(_\d+)?\.json/], [transChat, transBattle, battleNote]],
  [[/\/rest\/(multi)?raid\/ability_result\.json/,
    /\/rest\/(multi)?raid\/temporary_item_result\.json/,
    /\/rest\/(multi)?raid\/normal_attack_result\.json/,
    /\/rest\/(multi)?raid\/summon_result\.json/,
    /\/rest\/tutorial\/tutorial_battle_\d+(_\d+)?\.json/], [transBattleR, battleNote]],
  [/\/rest\/.*?raid\/condition\/\d+\/\d\/\d\.json/, transBuff],
  ['/user/status', replaceHourU],
  [['/weapon/weapon/', '/archive/weapon_detail'], weaponSkill],
  [['/summon/summon/', '/archive/summon_detail'], summonSkill],
  [['/rest/arcarum/move_division',
    '/rest/arcarum/start_stage',
    '/rest/arcarum/open_gatepost',
    '/rest/arcarum/open_chest',
    '/rest/arcarum/next_stage',
    '/rest/arcarum/stage'], transArcarum],
  [/\/story_chapter_list\/\d+(_\d+)?$/, chapterList],
  [/\/story_episode_list\/\d+(_\d+)?\/\d+(_\d+)?$/, episodeList],
  ['/archive/npc_detail', npcChapterList],
  [/^\/arcarum\/content\/summon_enhancement_detail\/\d+(_\d+)?$/, arcarumSceneName],
  ['/rest_shop_exchange_treasure/article_labels/', shopLabel],
  [/\/content\/navi/, storyNavi],
  [/^\/skin\/list\/\d+/, transSkin],
  [/^\/archive\/npc_list/, archiveCharName],
  [/^\/archive\/story_npc_detail/, storyNpcDetail]
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
