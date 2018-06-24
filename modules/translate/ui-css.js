const ip = require('ip')

const localIp = ip.address()

const transUI = (responseDetail, CONFIG) => {
  const cssLink = `http://${localIp}:${CONFIG.staticPort}/style/BLHXFY.css?lang=${CONFIG.lang}`
  let body = responseDetail.response.body.toString()
  body = body.replace(/<head>([\s\S]+?)<\/head>/, `<head>$1<link rel="stylesheet" type="text/css" media="screen" href="${cssLink}" /></head>`)
  responseDetail.response.body = body
  return responseDetail
}

module.exports = {
  transUI
}
