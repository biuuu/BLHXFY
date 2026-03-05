const rollup = require('rollup')
const { babel } = require('@rollup/plugin-babel')
const commonjs = require('@rollup/plugin-commonjs')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const json = require('@rollup/plugin-json')
const replace = require('@rollup/plugin-replace')
const terser = require('@rollup/plugin-terser')
const esbuild = require('rollup-plugin-esbuild').default
const { version } = require('../package.json')
const fse = require('fs-extra')

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

const build = async function (type = '') {
  const isDev = process.env.DEV === 'true'
  
  const meta = {
    name: `碧蓝幻想翻译${type === 'es5' ? '兼容版' : ''}`,
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

  let targets = '> 3%'
  if (type === 'es5') targets = 'since 2015'
  if (type === 'ios') targets = 'last 3 iOS versions'

  const plugins = [
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
    })
  ]

  if (isDev && !type) {
    plugins.push(esbuild({
      target: 'es2015',
      minify: false
    }))
  } else {
    plugins.push(babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: [['@babel/preset-env', {
        modules: false,
        targets: targets,
        useBuiltIns: 'entry',
        corejs: '3.27.1'
      }]]
    }))
    if (!isDev) {
      plugins.push(terser())
    }
  }

  // 自定义插件放在最后，保证 Header 在最前面且不被处理
  plugins.push(bannerPlugin(meta))

  const bundle = await rollup.rollup({
    input: './src/main.js',
    plugins: plugins
  })

  await bundle.write({
    file: `./dist/blhxfy/extension${type ? '.' + type : ''}.user.js`,
    format: 'iife',
    name: 'blhxfyex',
    intro: `const __win_blhxfy = window.unsafeWindow || window;
    if (__win_blhxfy.BLHXFY) return;
    __win_blhxfy.BLHXFY = true;`
  })
}

const start = async () => {
  console.log('ensure dist dir')
  await fse.ensureDir('./dist/blhxfy/')
  console.log('building userscript...')
  await build()
  if (process.env.DEV !== 'true') {
    await build('es5')
    await build('ios')
  }
}

if (require.main === module) {
  start()
}

module.exports = { build, start }
