import { scenarioCache } from '../modules/scenario'
import { getPreview, getPreviewCsv } from '../utils/'

const setLocalData = (name, csv) => {
  const data = getPreview()
  let exist = false
  for (let item of data) {
    if (item.name === name) {
      exist = true
      item.csv = csv
      break
    }
  }
  if (!exist) {
    if (data.length >= 5) {
      data.shift()
    }
    data.push({
      name, csv
    })
  }
  sessionStorage.setItem('blhxfy:preview', JSON.stringify(data))
}

export default function (type) {
  const cont = document.getElementById('blhxfy-story-input')
  if (type === 'hide') {
    cont.style.display = 'none'
  } else if (type === 'show') {
    const csv = getPreviewCsv(scenarioCache.name)
    cont.querySelector('textarea').value = csv
    cont.style.display = 'block'
  } else if (type === 'clear') {
    cont.querySelector('textarea').value = ''
  } else if (type === 'save') {
    setLocalData(scenarioCache.name, cont.querySelector('textarea').value)
    location.reload()
  }
}
