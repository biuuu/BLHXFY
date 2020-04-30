const ghpages = require('gh-pages')
const fse = require('fs-extra')

const start = async () => {
  if (process.env.CUSTOM_DOMAIN) {
    await fse.outputFile('./dist/CNAME', 'blhx.danmu9.com')
  }
  await fse.outputFile('./dist/blhxfy/game-config.js', `document.write('<script src="' + Game.jsUri + '/config.js?lyria"></script>')
document.write('<script src="https://cdn.jsdelivr.net/gh/biuuu/BLHXFY@gh-pages/blhxfy/extension.ios.user.js?t=' + Math.floor(Date.now()/21600000) + '"></script>')`)

  if (process.env.TRAVIS || process.env.GITHUB_ACTION) {
    return
  }
  console.log('start publish...')
  ghpages.publish('dist', {
    add: false
  }, function () {
    console.log('Finished at', '\x1b[36m\x1b[2m' + new Date().toLocaleString() + '\x1b[0m')
  })
}

start()
