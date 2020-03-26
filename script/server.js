const handler = require('serve-handler');
const http = require('http');
const open = require('open');

const server = http.createServer((request, response) => {
  // You pass two more arguments for config and middleware
  // More details here: https://github.com/zeit/serve-handler#options
  response.setHeader('Access-Control-Allow-Origin', '*');
  return handler(request, response, {
    public: './dist/'
  })
})

server.listen(15945, () => {
  console.log('Local server at http://127.0.0.1:15945');
  open('http://127.0.0.1:15945/blhxfy/extension.user.js')
});