import getNameData, { getNounData } from '../store/name-npc'
import { getStoryCSV } from '../store/story'
import transName from '../utils/trans-name'
import parseCsv from '../utils/parseCsv'
import config from '../config'
import insertToolHtml from '../story/insertToolHtml'
import autoDownloadCsv from '../setting/autoDownloadCsv'
import { getPreviewCsv, replaceWords, removeHtmlTag, restoreHtml, deepClone } from '../utils/'
import filter from '../utils/XSSFilter'
import transApi from '../utils/translation'
import setFont from '../setting/scenarioFont'

const txtKeys = ['chapter_name', 'synopsis', 'detail', 'sel1_txt', 'sel2_txt', 'sel3_txt', 'sel4_txt', 'sel5_txt', 'sel6_txt']

const scenarioCache = {
  data: null,
  name: '',
  originName: '',
  hasTrans: false,
  hasAutoTrans: false,
  csv: '',
  nameMap: null,
  transMap: null
}

const getFilename = (pathname) => {
  const rgs = pathname.match(/([^\/\\]+)$/)
  if (rgs && rgs[1]) {
    return rgs[1]
  }
  return pathname
}

const collectTxt = (data) => {
  const txtList = []
  const infoList = []
  const getTxt = (obj, key, index) => {
    const txt = obj[key]
    if (txt) {
      txtList.push(txt.replace(/\n/g, '').trim())
      infoList.push({
        id: obj.id, type: key, index
      })
    }
  }
  data.forEach((item, index) => {
    txtKeys.forEach(key => getTxt(item, key, index))
  })
  return { txtList, infoList }
}

const getStartIndex = (data) => {
  const findStart = (item, index) => {
    if (!item) return false
    if (item.detail) {
      return index
    } else if (item.next) {
      const next = (item.next | 0) || -1
      return findStart(data[next], next)
    } else {
      return findStart(data[index + 1], index + 1)
    }
  }
  return findStart(data[0], 0)
}

const transMulti = async (list, nameMap, nounMap, nounFixMap, caiyunPrefixMap) => {

  const userName = config.userName
  const lang = Game.lang
  const _list = list.map(txt => {

    txt = replaceWords(txt, caiyunPrefixMap, lang)

    if (userName) {
      let _lang = lang
      if (!/^\w+$/.test(userName)) _lang = 'unknown'
      if (lang === 'en') {
        txt = replaceWords(txt, new Map([[userName, config.defaultEnName]]), _lang)
      }
    }
    return txt
  })
  const transList = await transApi(_list, lang)
  if (transList[0] === 'caiyunoutoflimit') return ['机翻失败，请刷新重试']
  ;const fixedList = transList.map(txt => {
    let _str = txt
    if (_str) {
      _str = _str.replace(/\n/g, '<br>')
      _str = replaceWords(_str, nounFixMap, lang)
      if (config.displayName || userName) {
        const name = config.displayName || userName
        if (lang === 'en') {
          _str = _str.replace(new RegExp(`${config.defaultEnName}`, 'g'), name)
        }
        _str = _str.replace(new RegExp(`${config.defaultName}(先生|小姐)?`, 'g'), name)
      }
    }
    return _str
  })
  return fixedList
}

const getScenario = async (name) => {
  let csv = getPreviewCsv(name)
  let isLLMTrans = false
  if (!csv) {
    const [text, isAI] = await getStoryCSV(name)
    if (!text) {
      return { transMap: null, csv: '' }
    }
    csv = text
    isLLMTrans = isAI
  }
  const list = parseCsv(csv)
  const transMap = new Map()
  list.forEach(item => {
    if (item.id) {
      const idArr = item.id.split('-')
      const id = idArr[0]
      const type = idArr[1] || 'detail'
      const obj = transMap.get(id) || {}
      if (item.trans) {
        const rep = new RegExp(config.defaultName, 'g')
        const uname = config.displayName || config.userName
        const str = filter(item.trans.replace(rep, uname))
        obj[type] = str.replace(/<span\sclass="nickname"><\/span>/g, `<span class='nickname'></span>`)
      }
      obj[`${type}-origin`] = item.trans
      transMap.set(id, obj)
    }
  })
  return { transMap, csv, isLLMTrans }
}

const collectNameHtml = (str) => {
  if (!str) return str
  let name = str
  let html = ''
  const rgs = name.match(/<[^>]+>([^<]*)<\/[^>]+>/)
  if (rgs && rgs[1]) {
    name = rgs[1]
    html = str.replace(name, '$name')
  }
  return { name, html }
}

const replaceChar = (key, item, map) => {
  const nameStr = item[key] ? item[key].trim() : ''
  const { name, html } = collectNameHtml(nameStr)
  let trans
  if (name && name === config.userName && config.displayName) {
    trans = config.displayName
  } else {
    trans = transName(name, [map])
  }
  if (trans !== name) {
    if (html) {
      trans = html.replace('$name', trans)
    }
    item[key] = trans
  }
}

const getUsernameFromTutorial = (data) => {
  for (let item of data) {
    let id = parseInt(item.id)
    if (id === 25 || id === 24) {
      if (item.charcter1_name) {
        config.userName = item.charcter1_name
        localStorage.setItem('blhxfy:name', config.userName)
      }
    }
  }
}

const transStart = async (data, pathname) => {
  const pathRst = pathname.match(/\/[^/]*?scenario.*?\/(scene[^\/]+)\/?/)
  if (!pathRst || !pathRst[1]) return data
  let sNameTemp = pathRst[1]
  if (pathRst[1].includes('birthday') || pathname.includes('season_event')) {
    let rst = pathname.match(/\/[^/]*?scenario.*?\/(scene.+)$/)
    if (!rst || !rst[1]) return data
    sNameTemp = rst[1].replace(/\//g, '_')
  }
  if (pathname.includes('scene_tutorial02')) {
    getUsernameFromTutorial(data)
  }
  insertToolHtml()
  autoDownloadCsv()
  const startIndex = getStartIndex(data)
  const scenarioName = sNameTemp
  scenarioCache.data = deepClone(data)
  scenarioCache.name = scenarioName
  scenarioCache.hasTrans = false
  scenarioCache.hasAutoTrans = false
  scenarioCache.transMap = null
  let { transMap, csv, isLLMTrans } = await getScenario(scenarioName)
  if (transMap && transMap.has('filename')) {
    scenarioCache.originName = transMap.get('filename').detail
  }
  const nameData = await getNameData()
  const nameMap = Game.lang !== 'ja' ? nameData['enNameMap'] : nameData['jpNameMap']
  scenarioCache.nameMap = nameMap
  if (!transMap) {
    if ((config.transJa && Game.lang === 'ja') || (config.transEn && Game.lang === 'en')) {
      const { nounMap, nounFixMap, caiyunPrefixMap } = await getNounData()
      transMap = new Map()
      const { txtList, infoList } = collectTxt(data)
      const transList = await transMulti(txtList, nameMap, nounMap, nounFixMap, caiyunPrefixMap)
      let transNotice = false
      const transApiName = {
        caiyun: ['彩云小译', 'https://fanyi.caiyunapp.com/']
      }
      const apiData = transApiName[config.transApi]
      infoList.forEach((info, index) => {
        const obj = transMap.get(info.id) || {}
        obj[info.type] = transList[index] || ''
        if (!transNotice && info.index === startIndex && info.type === 'detail' && transList.length > 0) {
          if (transList[0] === 'caiyunoutoflimit') {
            // obj[info.type] = ``
          } else {
            obj[info.type] = `<a href="${apiData[1]}" target="_blank" class="autotrans-hint-blhxfy ${config.transApi}-blhxfy"> </a>${obj[info.type]}`
          }
          transNotice = true
        }
        transMap.set(info.id, obj)
      })
      if (transList.length > 0) {
        scenarioCache.hasAutoTrans = true
        scenarioCache.transMap = transMap
      }
    } else {
      return data
    }
  } else {
    scenarioCache.hasTrans = true
    scenarioCache.csv = csv
    scenarioCache.transMap = transMap
  }

  if (scenarioCache.hasAutoTrans || scenarioCache.hasTrans) {
    setFont()
  }

  data.forEach((item, index) => {
    replaceChar('charcter1_name', item, nameMap)
    replaceChar('charcter2_name', item, nameMap)
    replaceChar('charcter3_name', item, nameMap)

    const obj =  transMap.get(item.id)
    if (!obj) return
    txtKeys.forEach(key => {
      if (obj[key]) {
        if (key === 'detail' && config.originText) {
          item[key] = `${restoreHtml(obj[key], item[key])}
          <div class="blhxfy-origin-text" data-text='${removeHtmlTag(item[key], 0, true)}'> </div>`
        } else {
          item[key] = restoreHtml(obj[key], item[key])
        }
        if (scenarioCache.hasTrans && config.showTranslator && key === 'detail' && index === startIndex) {
          let name = '我们仍未知道翻译这篇剧情的骑空士的名字'
          if (transMap.has('translator')) {
            name = transMap.get('translator').detail || name
          }
          const translatorHint = isLLMTrans ? `本节使用 ${name} 机翻` : `译者：${name}`
          item[key] = `<a class="autotrans-hint-blhxfy translator-blhxfy" data-text="${translatorHint}"> </a>${item[key]}`
        }
      }
    })
  })

  return data
}


// ↓ gemini
/**
 * 根据给定的路径列表，安全地从对象中获取嵌套属性值。
 * @param {object} obj - 要访问的对象。
 * @param {string[]} path - 描述属性路径的字符串数组，例如 ['scenario', 'scene_list']。
 * @returns {*} 找到的属性值，如果路径无效则返回 undefined。
 */
const getValueByPath = (obj, path) => {
  // 使用 reduce 方法沿着路径逐层深入对象
  return path.reduce((currentObject, key) => {
    // 如果当前对象有效且包含下一个键，则继续深入，否则返回 undefined
    return currentObject && currentObject[key] !== undefined ? currentObject[key] : undefined;
  }, obj);
};

/**
 * 以不可变的方式，根据路径设置对象中的嵌套属性值。
 * 这意味着它会返回一个新对象，而不是修改原始对象。
 * @param {object} obj - 要更新的对象。
 * @param {string[]} path - 描述属性路径的字符串数组。
 * @param {*} value - 要设置的新值。
 * @returns {object} 一个新的、更新了值的对象。
 */
const setValueByPath = (obj, path, value) => {
  // 创建一个对象的浅拷贝，避免直接修改原始对象
  const newObj = { ...obj };

  // lastKey 指向路径的最后一个键，例如 'scene_list'
  const lastKey = path[path.length - 1];
  // parentPath 指向除最后一个键之外的路径，例如 ['scenario']
  const parentPath = path.slice(0, -1);

  // 逐层深入到目标属性的父对象
  let currentLevel = newObj;
  parentPath.forEach(key => {
    // 为了保证不可变性，路径上的每个对象也需要被拷贝
    // 如果当前层级的对象不存在或不是对象，就创建一个新对象
    currentLevel[key] = (currentLevel[key] && typeof currentLevel[key] === 'object') ? { ...currentLevel[key] } : {};
    currentLevel = currentLevel[key];
  });

  // 在父对象上设置新值
  currentLevel[lastKey] = value;

  return newObj;
};

/**
 * 递归处理数据对象，查找并转换指定路径下的数组。
 * @param {object} data - 原始数据对象。
 * @param {string[][]} keyPaths - 一个包含多个路径的数组，每个路径本身也是一个键的数组。
 * @param {any} pathname - 传递给 transStart 的参数。
 * @returns {Promise<object>} 返回处理后的数据对象。
 */
async function processDataByPaths(data, keyPaths, pathname) {
  // 遍历所有预设的可能路径
  for (const path of keyPaths) {
    // 根据当前路径获取目标值
    const targetArray = getValueByPath(data, path);

    // 检查获取到的值是否为数组
    if (Array.isArray(targetArray)) {
      // 如果是数组，使用 transStart 函数进行处理
      const processedArray = await transStart(targetArray, pathname);
      // 将处理后的数组放回原有的嵌套结构中，并返回一个新的对象
      return setValueByPath(data, path, processedArray);
    }
  }

  // 如果遍历完所有路径都没有找到数组，则返回原始数据
  return data;
}

/**
 * 主处理函数，根据不同的数据结构，对其中的数组部分进行转换。
 * @param {object|Array} data - 输入的数据，可能是一个数组，或包含数组的复杂对象。
 * @param {any} pathname - 传递给 transStart 的参数。
 * @returns {Promise<object|Array>} 返回转换后的数据。
 */
export default async function (data, pathname) {
  // 1. 定义所有需要检查的嵌套路径
  // 如果将来有新的路径，只需在这里添加即可
  const keyPaths = [
    ['scene_list'],           // 对应 data.scene_list
    ['scenario'],             // 对应 data.scenario
    ['scenario', 'scene_list']  // 对应 data.scenario.scene_list
  ];

  // 2. 首先处理最简单的情况：data 本身就是一个数组
  if (Array.isArray(data)) {
    return await transStart(data, pathname);
  }

  // 3. 如果 data 是一个对象，则调用辅助函数来处理定义的各个路径
  if (data && typeof data === 'object') {
     return await processDataByPaths(data, keyPaths, pathname);
  }

  // 4. 如果 data 不是数组也不是对象，直接返回
  return data;
}

export { scenarioCache, replaceChar }
