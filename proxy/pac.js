module.exports = function ({ apiHostNames, staticHostNames, staticServer, frontAgent, port, frontAgentHost, frontAgentPort }) {
  const condition1 = apiHostNames.map(name => {
    return `shExpMatch(host, "${name}")`
  }).join('||')
  const condition2 = staticHostNames.map(name => {
    return `shExpMatch(host, "${name}")`
  }).join('||')

  const getScript = (condition) => (conditionEx) => (result) => {
    const template = `
      function FindProxyForURL(url, host) {
        if (${condition} || ${conditionEx}) {
          return "PROXY 127.0.0.1:${port}; DIRECT";
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
