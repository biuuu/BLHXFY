
import getSkillData from '../store/skill-job'
import isObject from 'lodash/isObject'
import isArray from 'lodash/isArray'
import replaceTurn from '../utils/replaceTurn'
import getNpcSkillData from '../store/skill-npc'
import { getPlusStr, removeHtmlTag, race } from '../utils/'

const skillTemp = new Map()
const posMap = new Map()
let timer = null
let count = 0
let observered = false
let obConfig = {
  attributes: true,
  subtree: true
}

const mutationCallback = (mutationsList) => {
  for (let mutation of mutationsList) {
    const type = mutation.type
    const attr = mutation.attributeName
    const target = mutation.target
    if (target.classList.contains('lis-ability') && type === 'attributes' && attr === 'title') {
      const title = target.title
      if (title && title.endsWith('turn(s)')) {
        viraSkillTitle()
      }
    }
  }
}

const viraSkillTitle = () => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    const list = $('.lis-ability')
    if (list.length) {
      count = 0
      if (!observered) {
        const targetNode = document.querySelector('.prt-command')
        const observer = new MutationObserver(mutationCallback)
        observer.observe(targetNode, obConfig)
        observered = true
      }
      list.each(function () {
        const $elem = $(this)
        const title = $elem.attr('title')
        if (!title) return
        const name = title.split('\n')[0]
        const trans = skillTemp.get(name)
        if (trans) {
          const [plus1] = getPlusStr(name)
          const sName = trans.name + plus1
          const detail = removeHtmlTag(trans.detail.replace(/<br\s?\/?>/gi, '\n'))
          $elem.attr('title', title.replace(/^([\s\S]+)Cooldown:\s(\d+)\sturn\(s\)$/, `${sName}\n${detail}\n使用间隔：$2 回合`))
        } else {
          $elem.attr('title', title.replace(/^([\s\S]+)Cooldown:\s(\d+)\sturn\(s\)$/, `$1使用间隔：$2 回合`))
        }
      })
    } else if (count < 20) {
      count++
      viraSkillTitle()
    }
  }, 500)
}


const collectNpcSkill = (skillData) => {
  for (let key in skillData) {
    if (/(skill|special)-\D.*/.test(key)) {
      const rgs = key.match(/(skill|special)-(\D.*)/)
      if (rgs && rgs[2] && !skillTemp.has(rgs[2])) {
        skillTemp.set(rgs[2], skillData[key])
      }
    }
  }
}

const battle = async function (data, mode) {
  let ability
  let scenario
  let spms
  if (mode === 'result') {
    if (isObject(data.status)) {
      ability = data.status.ability
      spms = data.status.skip_special_motion_setting
    }
    if (isObject(data.scenario)) scenario = data.scenario
  } else {
    ability = data.ability
    spms = data.skip_special_motion_setting
    data.temporary_potion_all_name = '群体回复药水'
    data.temporary_potion_one_name = '治疗药水'
  }
  if (isArray(spms)) {
    spms.forEach(item => {
      posMap.set(item.pos, item.setting_id)
    })
  }

  // translate skill
  if (isObject(ability)) {
    for (let abKey in ability) {
      let item = ability[abKey]
      if (item && isObject(item.list)) {
        if (item.mode === 'player') {
          for (let key in item.list) {
            let arr = item.list[key]
            let skill = arr[0]
            if (skill && skill['ability-name']) {
              const name = skill['ability-name']
              const trans = await getSkillData(name)
              if (trans) {
                if (!skillTemp.has(name)) skillTemp.set(name, trans)
                skill['ability-name'] = trans.name
                skill['text-data'] = trans.detail
              }
              skill['duration-type'] = replaceTurn(skill['duration-type'])
            }
          }
        } else if (item.mode === 'npc') {
          const npcId = posMap.get(item.pos)
          const state = await getNpcSkillData(npcId)
          const skillData = state.skillMap.get(npcId)
          if (skillData && isObject(item.list)) {
            collectNpcSkill(skillData)
            let index = 0
            for (let key in item.list) {
              index++
              let arr = item.list[key]
              let skill = arr[0]
              if (skill && skill['ability-name']) {
                const name = skill['ability-name']
                if (skillData[`skill-${name}`]) {
                  const trans = skillData[`skill-${name}`]
                  if (trans) {
                    if (!skillTemp.has(name)) skillTemp.set(name, trans)
                    skill['ability-name'] = trans.name
                    skill['text-data'] = trans.detail
                  }
                } else {
                  const [plus1, plus2] = getPlusStr(name)
                  let trans = skillData[`skill-${index}${plus2}`]
                  if (!trans) trans = skillData[`skill-${index}`]
                  if (trans) {
                    if (!skillTemp.has(name)) skillTemp.set(name, trans)
                    skill['ability-name'] = `${trans.name}${plus1}`
                    skill['text-data'] = trans.detail
                  }
                  skill['duration-type'] = replaceTurn(skill['duration-type'])
                }
              }
            }
          }
        }
      }
    }
  }

  // translate speciall skill
  if (mode !== 'result' && data.player && isArray(data.player.param)) {
    const param = data.player.param
    let index = 0
    for (let item of param) {
      const npcId = posMap.get(index)
      index++
      const state = await getNpcSkillData(npcId)
      const skillData = state.skillMap.get(npcId)
      if (skillData) {
        collectNpcSkill(skillData)
        if (item['special_skill']) {
          const name = item['special_skill']
          if (skillData[`special-${name}`]) {
            const trans = skillData[`special-${name}`]
            if (trans) {
              if (!skillTemp.has(name)) skillTemp.set(name, trans)
              item['special_skill'] = trans.name
              item['special_comment'] = trans.detail
            }
          } else {
            const [plus1, plus2] = getPlusStr(name)
            let trans = skillData[`special${plus2}`]
            if (!trans) trans = skillData['special']
            if (trans) {
              if (!skillTemp.has(name)) skillTemp.set(name, trans)
              item['special_skill'] = `${trans.name}${plus1}`
              item['special_comment'] = trans.detail
            }
          }
        }
      }
    }
  }

  // translate scenario
  if (scenario) {
    for (let scKey in scenario) {
      let item = scenario[scKey]
      if (item && item.name) {
        if (item.cmd === 'ability') {
          const trans = skillTemp.get(item.name)
          const [plus1] = getPlusStr(item.name)
          if (trans) {
            item.name = trans.name + plus1
            item.comment = trans.detail
          }
        } else if (item.cmd === 'special_npc') {
          const trans = skillTemp.get(item.name)
          const [plus1] = getPlusStr(item.name)
          if (trans) {
            item.name = trans.name + plus1
          }
        } else if (item.cmd === 'special_change') {
          const trans = skillTemp.get(item.name)
          const [plus1] = getPlusStr(item.name)
          if (trans) {
            item.name = trans.name + plus1
            item.text = trans.detail
          }
        }
      }
    }
  }

  viraSkillTitle()
  return data
}

export default race(battle)
