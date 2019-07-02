const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const cmjs = require('rollup-plugin-commonjs')
const resolve = require('rollup-plugin-node-resolve')
const json = require('rollup-plugin-json')
const { version } = require('../package.json')
const fse = require('fs-extra')

const build = async function (type = '') {
  const banner = `// ==UserScript==
// @name         碧蓝幻想翻译${type === 'es5' ? '兼容版' : ''}
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
// @updateURL    https://blhx.danmu9.com/blhxfy/extension${type ? '.' + type : ''}.user.js
// @supportURL   https://github.com/biuuu/BLHXFY/issues
// ==/UserScript==`

  let targets = '> 3%'
  if (type === 'es5') targets = 'since 2015'
  if (type === 'ios') targets = 'last 3 iOS versions'

  const bundle = await rollup.rollup({
    input: './src/main.js',
    plugins: [
      resolve({ preferBuiltins: false }),
      cmjs({ ignore: ['stream'] }),
      json(),
      babel({
        exclude: 'node_modules/**',
        presets: [['@babel/preset-env', {
          modules: false,
          useBuiltIns: 'usage',
          targets: targets
        }]]
      })
    ]
  })

  await bundle.write({
    file: `./dist/blhxfy/extension${type ? '.' + type : ''}.user.js`,
    format: 'iife',
    name: 'blhxfyex',
    banner: banner
  })
}

const start = async () => {
  console.log('clean dist')
  await fse.emptyDir('./dist/')
  console.log('building userscript...')
  await build()
  await build('es5')
  await build('ios')
}

start()
