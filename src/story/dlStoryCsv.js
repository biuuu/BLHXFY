import { scenarioCache } from '../modules/scenario'
import { tryDownload } from '../utils/'
import { dataToCsv } from '../utils/scenarioData'

export default function (type = 'normal') {
  if (type === 'normal') {
    tryDownload(dataToCsv(scenarioCache.data, scenarioCache), scenarioCache.name + '.csv')
  } else if (type === 'trans') {
    if (scenarioCache.hasTrans) {
      tryDownload(dataToCsv(scenarioCache.data, scenarioCache, false, true), `${scenarioCache.originName || scenarioCache.name}.csv`)
    } else {
      if (scenarioCache.hasAutoTrans) {
        if (confirm('这个章节还没有翻译，是否下载含有机翻文本的文件。')) {
          tryDownload(dataToCsv(scenarioCache.data, scenarioCache, false, false, true), scenarioCache.name + '.csv')
        }
      } else {
        alert('这个章节还没有翻译。')
      }
    }
  } else if (type === 'fill') {
    tryDownload(dataToCsv(scenarioCache.data, scenarioCache, true), scenarioCache.name + '.csv')
  }
}

export { dataToCsv }
