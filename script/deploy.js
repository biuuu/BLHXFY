const fse = require('fs-extra')

const start = async () => {
  if (process.env.CUSTOM_DOMAIN) {
    await fse.outputFile('./dist/CNAME', 'blhx.danmu9.com')
  }
  await fse.outputFile('./dist/blhxfy/game-config.js', `document.write('<script src="' + Game.jsUri + '/config.js?lyria"></script>')
document.write('<script src="https://cdn.jsdelivr.net/gh/biuuu/BLHXFY@gh-pages/blhxfy/extension.ios.user.js?t=' + Math.floor(Date.now()/21600000) + '"></script>')`)

  console.log('Post-build tasks finished.')
}

start()
