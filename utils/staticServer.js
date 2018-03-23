var st = require('st')
var http = require('http')

const startServer = (stPath, port) => {
  http.createServer(
    st({
     path: stPath,
     cors: true
    })
  ).listen(port)
}

module.exports = startServer