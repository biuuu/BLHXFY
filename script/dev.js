const rollup = require('rollup')
const { build, start: startBuild } = require('./build')
const { start: startData } = require('./data')
const { startServer } = require('./server')
const fs = require('fs')
const path = require('path')

const bannerPlugin = (meta) => {
  const items = ['// ==UserScript==']
  for (const [key, value] of Object.entries(meta)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        items.push(`// @${key.padEnd(14)} ${item}`)
      }
    } else {
      items.push(`// @${key.padEnd(14)} ${value}`)
    }
  }
  items.push('// ==/UserScript==')
  const banner = items.join('\n')
  return {
    name: 'banner-plugin',
    renderChunk(code) {
      return banner + '\n\n' + code
    }
  }
}

const watchCode = () => {
  console.log('Watching code changes...')
  const { babel } = require('@rollup/plugin-babel')
  const commonjs = require('@rollup/plugin-commonjs')
  const { nodeResolve } = require('@rollup/plugin-node-resolve')
  const json = require('@rollup/plugin-json')
  const replace = require('@rollup/plugin-replace')
  const esbuild = require('rollup-plugin-esbuild').default
  const { version } = require('../package.json')

  const isDev = process.env.DEV === 'true'
  const type = '' // default type
  
  const meta = {
    name: '碧蓝幻想翻译',
    namespace: 'https://github.com/biuuu/BLHXFY',
    version: version,
    description: '碧蓝幻想的汉化脚本，提交新翻译请到 https://github.com/biuuu/BLHXFY',
    icon: 'http://game.granbluefantasy.jp/favicon.ico',
    author: 'biuuu',
    match: [
      '*://game.granbluefantasy.jp/*',
      '*://gbf.game.mbga.jp/*'
    ],
    'run-at': 'document-body',
    grant: 'GM_xmlhttpRequest',
    connect: [
      'api.interpreter.caiyunai.com',
      'api.openai.com',
      'api.anthropic.com',
      'api.deepseek.com',
      'generativelanguage.googleapis.com',
      'openrouter.ai'
    ],
    updateURL: `https://blhx.danmu9.com/blhxfy/extension${type ? '.' + type : ''}.user.js`,
    supportURL: 'https://github.com/biuuu/BLHXFY/issues'
  }

  const watcher = rollup.watch({
    input: './src/main.js',
    plugins: [
      nodeResolve(),
      commonjs({ ignore: ['stream'] }),
      json(),
      replace({
        preventAssignment: true,
        values: {
          'process.env.DEV': JSON.stringify(isDev),
          'process.env.LOCAL_HOST': JSON.stringify(process.env.LOCAL_HOST === 'true'),
          'DEV': JSON.stringify(isDev),
          'LOCAL_HOST': JSON.stringify(process.env.LOCAL_HOST === 'true'),
          '__DEV__': JSON.stringify(isDev)
        }
      }),
      esbuild({
        target: 'es2015',
        minify: false
      }),
      bannerPlugin(meta)
    ],
    output: {
      file: `./dist/blhxfy/extension.user.js`,
      format: 'iife',
      name: 'blhxfyex',
      intro: `const __win_blhxfy = window.unsafeWindow || window;
      if (__win_blhxfy.BLHXFY) return;
      __win_blhxfy.BLHXFY = true;`
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
