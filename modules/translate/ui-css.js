

const transUI = (responseDetail, CONFIG) => {
  const cssLink = `http://127.0.0.1:${CONFIG.staticPort}/style/BLHXFY.css`
  let body = responseDetail.response.body.toString()
  body = body.replace(/<head>([\s\S]+?)<\/head>/, `<head>$1<link rel="stylesheet" type="text/css" media="screen" href="${cssLink}" /></head>`)
  responseDetail.response.body = body
  return responseDetail
}

module.exports = {
  transUI
}
