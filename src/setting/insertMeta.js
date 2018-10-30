import config from '../config'

document.addEventListener('DOMContentLoaded', function () {
  document.head.insertAdjacentHTML('afterbegin', `
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <link rel="apple-touch-startup-image" href="${config.origin}/blhxfy/data/static/image/splash.png">
  `)
  document.querySelector('meta[name="apple-mobile-web-app-title"]').setAttribute('content', '碧蓝幻想')
  document.title = '碧蓝幻想'
})
