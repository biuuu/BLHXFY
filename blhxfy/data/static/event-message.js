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