
const replaceHTML = async (html) => {
  return html
}

export default async function transHTML(data, pathname) {
  if (!data.data) return data
  let html
  try {
    html = decodeURIComponent(data.data)
  } catch (err) {
    console.log(err)
    return data
  }
  html = await replaceHTML(html)
  data.data = encodeURIComponent(html)
  return data
}
