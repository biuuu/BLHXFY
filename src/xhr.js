import translate from './translate'

const injectXHR = () => {
  // The following code are inspired by viramate/external.js
  // intercept xhr request and modify the response
  const XHR = XMLHttpRequest
  const originOpen = XHR.prototype.open
  const originSend = XHR.prototype.send
  const originAddEventListener = XHR.prototype.addEventListener

  const stateMap = new WeakMap()

  function log (data) {
    console.error(data)
  }

  function getXhrState(xhr) {
    let result = stateMap.get(xhr)
    if (!result) {
      result = {}
      stateMap.set(xhr, result)
    }
    if (!result.readyStateListeners) {
      result.readyStateListeners = []
    }
    if (!result.loadListeners) {
      result.loadListeners = []
    }

    return result
  }



  const customOnLoad = async function (evt) {
    const state = getXhrState(this)
    state.onLoadEvent = evt
    Object.defineProperties(this, {
      response: {
        get () {
          return state.result
        }
      },
      responseText: {
        get () {
          return state.result
        }
      }
    })
    try {
      await translate(state)
    } catch (err) {
      log(err)
    }
    state.onload && state.onload.call(this, state.onLoadEvent)
  }

  const customOnReadyStateChange = async function () {
    let state
    try {
      state = getXhrState(this)
      if (this.readyState == XHR.DONE) {
        state.onComplete.call(this, state)
      }
    } catch (err) {
      log(err)
    }
    try {
      for (let i = 0, l = state.readyStateListeners.length; i < l; i++) {
        try {
          state.readyStateListeners[i].apply(this, arguments)
        } catch (err) {
          log(err)
        }
      }
    } catch (err) {
      log(err)
    }
  }

  function customOnComplete(state) {
    if (state.done) return
    state.done = performance.now()
    state.response = this.response
    state.responseType = this.responseType
    if ((state.responseType === "") || (state.responseType === "text")) {
      state.responseText = this.responseText
      state.result = this.response || this.responseText
    }
    state.status = this.status
    state.statusText = this.statusText
    state.contentType = this.getResponseHeader('content-type')
  }

  XHR.prototype.open = function open (method, url, async, user, password) {
    try {
      const state = getXhrState(this)
      state.method = method
      state.url = url
    } catch (err) {
      log(err)
    }
    originAddEventListener.call(this, "readystatechange", customOnReadyStateChange, false)
    const result = originOpen.apply(this, arguments)
    return result
  }

  XHR.prototype.addEventListener = function addEventListener (eventName, listener, useCapture) {
    try {
      const state = getXhrState(this)
      if (eventName === "readystatechange") {
        state.readyStateListeners.push(listener)
        return true
      }
    } catch (err) {
      log(err)
    }
    const result = originAddEventListener.apply(this, arguments)
    return result
  }

  XHR.prototype.send = function send(data) {
    let state = null
    try {
      state = getXhrState(this)
      if (state.url) {
        state.sent = performance.now()
        state.data = data
        state.onComplete = customOnComplete
        state.onload = this.onload
        this.onload = customOnLoad
      }
    } catch (err) {
      log(err)
    }
    originSend.call(this, data)
  }

  XHR.prototype.open.toString = function toString() {
    return originOpen.toString()
  }
  XHR.prototype.addEventListener.toString = function toString() {
    return originAddEventListener.toString()
  }
  XHR.prototype.send.toString = function toString() {
    return originSend.toString()
  }
}

export default injectXHR
