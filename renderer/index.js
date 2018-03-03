const ElementUI = require('element-ui')
require('./form-config')
Vue.use(ElementUI)

new Vue({
  el: '#app',
  data: {
    visible: false
  }
})