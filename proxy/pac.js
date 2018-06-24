const ip = require('ip')

const someHostList = [
  'www.google.com',
  'csp.withgoogle.com',
  'www.gstatic.com'
]

const localIp = ip.address()

module.exports = function ({ apiHostNames, staticHostNames, staticServer, frontAgent, port, frontAgentHost, frontAgentPort }) {
  const condition1 = apiHostNames.map(name => {
    return `shExpMatch(host, "${name}")`
  }).join('||')
  const condition2 = staticHostNames.map(name => {
    return `shExpMatch(host, "${name}")`
  }).join('||')
  const condition3 = someHostList.map(name => {
    return `shExpMatch(host, "${name}")`
  }).join('||')

  const getScript = (condition) => (conditionEx) => (result) => {
    const template = `
      function FindProxyForURL(url, host) {
        if (isInNet(dnsResolve(host),"127.0.0.1","127.0.0.255")) {
          return "DIRECT";
        }
        if (shExpMatch(host, "${localIp}")) {
          return "DIRECT";
        }
        if (${condition} || ${conditionEx}) {
          return "PROXY ${localIp}:${port}; DIRECT";
        }
        if (!${frontAgent} && (${condition3})) {
          return "PROXY ${localIp}:1080; PROXY ${localIp}:8094; PROXY ${localIp}:8123; PROXY ${localIp}:8099; PROXY ${localIp}:8080; DIRECT";
        }
        return "${result}";
      }
    `
    return template
  }

  let script = getScript(condition1)
  if (staticServer) {
    script = script(condition2)
  } else {
    script = script('false')
  }
  if (frontAgent) {
    script = script(`PROXY ${localIp}:${frontAgentPort}; DIRECT`)
  } else {
    script = script('DIRECT')
  }
  return script
}
