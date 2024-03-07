import pako from 'pako/dist/pako_inflate.min.js'
import fetchData from '../fetch'
import config from '../config'

let storyData = null
let storyDataAI = null

export const getStoryCSV = async (name) => {
  if (!storyData) {
    const binaryString = await fetchData('/blhxfy/data/story-map.json')
    storyData = JSON.parse(pako.inflate(binaryString, { to: 'string' }))
  }
  if ((config.transJa && Game.lang === 'ja') || (config.transEn && Game.lang === 'en')) {
    if (!storyDataAI) {
      try {
        const binaryString = await fetchData('https://blhx-ai.danmu9.com/blhxfy/story-map.json')
        storyDataAI = JSON.parse(pako.inflate(binaryString, { to: 'string' }))
      } finally {}
    }
  }
  let isAI = false
  let csv = ''
  if (storyData[name]) {
    csv = await fetchData(`/blhxfy/data/story/${storyData[name]}`)
  } else if (storyDataAI && storyDataAI[name]) {
    csv = await fetchData(`https://blhx-ai.danmu9.com/blhxfy/story/${storyDataAI[name]}`)
    isAI = true
  }
  return [csv, isAI]
}