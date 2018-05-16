const someHostList = [
  'www.google.com',
  'csp.withgoogle.com',
  'www.gstatic.com'
]

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
        if (${condition} || ${conditionEx}) {
          return "PROXY 127.0.0.1:${port}; DIRECT";
        }
        if (!${frontAgent} && (${condition3})) {
          return "PROXY 127.0.0.1:1080; PROXY 127.0.0.1:8094; PROXY 127.0.0.1:8123; PROXY 127.0.0.1:8099; DIRECT";
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
    script = script(`PROXY ${frontAgentHost}:${frontAgentPort}; DIRECT`)
  } else {
    script = script('DIRECT')
  }
  return script
}
