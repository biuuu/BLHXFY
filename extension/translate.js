import fetch from './fetch'

export default async function translate(state) {
  fetch('/blhxfy/manifest.json').then(data => {
    console.log(data)
  })
}
