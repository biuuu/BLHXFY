const rollup = require('rollup')
const { build, start: startBuild } = require('./build')
const { start: startData } = require('./data')
const { startServer } = require('./server')
const fs = require('fs')
const path = require('path')

const watchCode = () => {
  console.log('Watching code changes...')
  const babel = require('rollup-plugin-babel')
  const cmjs = require('rollup-plugin-commonjs')
  const resolve = require('rollup-plugin-node-resolve')
  const json = require('rollup-plugin-json')
  const { version } = require('../package.json')

  const type = '' // default type
  const banner = `// ==UserScript==
// @name         碧蓝幻想翻译
// @namespace    https://github.com/biuuu/BLHXFY
// @version      ${version}
// @description  碧蓝幻想的汉化脚本，提交新翻译请到 https://github.com/biuuu/BLHXFY
// @icon         http://game.granbluefantasy.jp/favicon.ico
// @author       biuuu
// @match        *://game.granbluefantasy.jp/*
// @match        *://gbf.game.mbga.jp/*
// @run-at       document-body
// @grant        GM_xmlhttpRequest
// @connect      translate.google.cn
// @connect      api.interpreter.caiyunai.com
// @connect      fanyi.baidu.com
// @updateURL    https://blhx.danmu9.com/blhxfy/extension${type ? '.' + type : ''}.user.js
// @supportURL   https://github.com/biuuu/BLHXFY/issues
// ==/UserScript==`

  const watcher = rollup.watch({
    input: './src/main.js',
    plugins: [
      resolve(),
      cmjs({ ignore: ['stream'] }),
      json(),
      babel({
        exclude: 'node_modules/**',
        presets: [['@babel/preset-env', {
          modules: false,
          targets: '> 3%',
          useBuiltIns: 'entry',
          corejs: '3.27.1'
        }]]
      })
    ],
    output: {
      file: `./dist/blhxfy/extension.user.js`,
      format: 'iife',
      name: 'blhxfyex',
      banner: banner,
      intro: `const __win_blhxfy = window.unsafeWindow || window;
      if (__win_blhxfy.BLHXFY) return;
      __win_blhxfy.BLHXFY = true;
      const DEV = ${process.env.DEV ? true : false};
      const LOCAL_HOST = ${process.env.LOCAL_HOST ? true : false};`
    }
  })

  watcher.on('event', event => {
    if (event.code === 'BUNDLE_START') {
      console.log('Rebuilding userscript...')
    } else if (event.code === 'BUNDLE_END') {
      console.log('Userscript rebuilt.')
    } else if (event.code === 'ERROR') {
      console.error('Rollup error:', event.error)
    }
  })
}

const debounce = (fn, delay) => {
  let timer = null
  return function () {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, arguments)
    }, delay)
  }
}

const watchData = () => {
  console.log('Watching data changes...')
  const debouncedStartData = debounce(async (filename) => {
    console.log(`Data file changed: ${filename}, re-processing...`)
    try {
      await startData()
      console.log('Data processed.')
    } catch (err) {
      console.error('Data processing error:', err)
    }
  }, 500)

  fs.watch('./data/', { recursive: true }, (eventType, filename) => {
    if (filename && 
        (filename.endsWith('.csv') || filename.endsWith('.json')) && 
        !filename.startsWith('.')) {
      debouncedStartData(filename)
    }
  })
}

const start = async () => {
  process.env.DEV = 'true'
  process.env.LOCAL_HOST = 'true'

  console.log('Initial build...')
  await startBuild()
  await startData()

  startServer()
  watchCode()
  watchData()
}

start()
