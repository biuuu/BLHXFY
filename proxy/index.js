const AnyProxy = require('anyproxy')
const CONFIG = require('../config.js')

module.exports = () => {
  const options = {
    port: CONFIG.port,
    rule: require('./rule.js'),
    webInterface: {
      enable: CONFIG.webInterface,
      webPort: CONFIG.webPort
    }
  }

  const proxyServer = new AnyProxy.ProxyServer(options)

  proxyServer.on('ready', () => { 
    
  })

  proxyServer.on('error', (e) => { 
    
  })
  proxyServer.start()
}