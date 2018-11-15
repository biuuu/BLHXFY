import setting from '../setting/'
import dlStoryCsv from '../story/dlStoryCsv'
import previewCsv from '../story/previewCsv'

export default function () {
  document.addEventListener('DOMContentLoaded', function () {
    const script = document.createElement('script')
    script.innerHTML = `
    window.blhxfy || (window.blhxfy = {})
    window.blhxfy.sendEvent = function (name, type, data) {
      var event = new CustomEvent('blhxfy:message', {
        detail: {
          type: type,
          data: data,
          name: name
        }
      })
      document.body.dispatchEvent(event)
    }
    `
    document.head.appendChild(script)
    document.body.addEventListener('blhxfy:message', function (e) {
      const { name, type, data } = e.detail
      console.log(name, type, data)
      if (name === 'setting') {
        setting(type, data)
      } else if (name === 'dlStoryCsv') {
        dlStoryCsv(type, data)
      } else if (name === 'previewCsv') {
        previewCsv(type, data)
      }
    })
  })
}