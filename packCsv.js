const gulp = require('gulp')
const md5File = require('md5-file')
const del = require('del')
const fs = require('fs-extra')
const CSV = require('papaparse')
const path = require('path')
const ghpages = require('gh-pages')
const { writeFile } = require('./utils/')
const CONFIG = require('./config')
const zip = require('gulp-zip')
const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const cmjs = require('rollup-plugin-commonjs')
const resolve = require('rollup-plugin-node-resolve')
const through = require('through2')

const scenarioMap = {}
const skillMap = {}

const collectCsv = function(type) {
  return through.obj(function(file, encoding, callback) {
    if (file.isNull()) {
        return callback(null, file)
    }

    if (file.isStream()) {
        this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported!'))
    } else if (file.isBuffer()) {
        const str = file.contents.toString()
        const list = CSV.parse(str.replace(/^\ufeff/, ''), { header: true }).data
        let newList = null
        if (type === 'scenario') {
          newList = list.map(item => {
            if (item.id === 'info') {
              scenarioMap[item.trans] = path.relative(path.resolve(__dirname, 'data/scenario/'), file.path).replace('\\', '/')
            }
            return item
          })
        } else if (type === 'skill') {
          newList = list.map(item => {
            if (item.id === 'npc') {
              const idArr = item.detail.split('|')
              if (idArr && idArr[0]) {
                skillMap[idArr[0]] = path.relative(path.resolve(__dirname, 'data/skill/'), file.path).replace('\\', '/')
              }
            }
            return item
          })
        }
        const newStr = CSV.unparse(newList)
        const newBuffer = Buffer.from(newStr)

        file.contents = newBuffer
        return callback(null, file)
    }
  })
}

gulp.task('clean:dist', function () {
  return del([
    './dist'
  ])
})

gulp.task('move:static', ['clean:dist'], function () {
  return gulp.src('./data/static/**/*')
    .pipe(gulp.dest('./dist/blhxfy/data/static/'))
})

gulp.task('move:normalcsv', ['clean:dist'], function () {
  return gulp.src('./data/*.csv')
    .pipe(gulp.dest('./dist/blhxfy/data/'))
})

gulp.task('move:html', ['clean:dist'], function () {
  return gulp.src('./data/*.html')
    .pipe(gulp.dest('./dist/blhxfy/data/'))
})

gulp.task('move:lecia', ['clean:dist'], function () {
  return gulp.src('./extension/lecia.html')
    .pipe(gulp.dest('./dist/blhxfy/'))
})

gulp.task('move:scenario', ['clean:dist'], function () {
  return gulp.src('./data/scenario/**/*.csv')
    .pipe(collectCsv('scenario'))
    .pipe(gulp.dest('./dist/blhxfy/data/scenario/'))
})

gulp.task('move:skill', ['clean:dist'], function () {
  return gulp.src('./data/skill/**/*.csv')
    .pipe(collectCsv('skill'))
    .pipe(gulp.dest('./dist/blhxfy/data/skill/'))
})

gulp.task('scenarioMap', ['move:scenario'], function (done) {
  fs.writeJson('./dist/blhxfy/data/scenario.json', scenarioMap, done)
})

gulp.task('skillMap', ['move:skill'], function (done) {
  fs.writeJson('./dist/blhxfy/data/skill.json', skillMap, done)
})

gulp.task('pack', ['move:static', 'move:lecia', 'move:html', 'extension', 'move:normalcsv', 'move:scenario', 'scenarioMap', 'cname'], function () {
  // asar.createPackage('./dist/blhxfy/data/', './dist/blhxfy/data.asar', done)
  return gulp.src('dist/blhxfy/data/**/*')
    .pipe(zip('data.zip'))
    .pipe(gulp.dest('dist/blhxfy/'))
})

gulp.task('md5', ['pack'], function (done) {
  md5File('./dist/blhxfy/data.zip', (err, hash) => {
    if (err) throw err
    fs.copy('./dist/blhxfy/data.zip', `./dist/blhxfy/data.${hash.slice(0,5)}.zip`, () => {
      fs.writeJson('./dist/blhxfy/manifest.json', { packname: `data.${hash.slice(0,5)}.zip`, hash }, () => {
        fs.remove('./dist/blhxfy/data.zip', done)
      })
    })
  })
})

gulp.task('cname', ['clean:dist'], function () {
  return writeFile('./dist/CNAME', CONFIG.csvHost)
})

gulp.task('publish', ['md5'], function (done) {
  ghpages.publish('dist', {
    add: false
  }, function () {
    done()
  })
})

const extensionVer = require('./extension/version.json').ver
const extensionBanner = `// ==UserScript==
// @name         碧蓝幻想翻译
// @namespace    https://github.com/biuuu/BLHXFY
// @version      ${extensionVer}
// @description  碧蓝幻想的汉化脚本，提交新翻译请到 https://github.com/biuuu/BLHXFY
// @icon         http://game.granbluefantasy.jp/favicon.ico
// @author       biuuu
// @match        *://game.granbluefantasy.jp/*
// @match        *://gbf.game.mbga.jp/*
// @run-at       document-body
// @grant        none
// @updateURL    https://blhx.danmu9.com/blhxfy/extension.user.js
// @supportURL   https://github.com/biuuu/BLHXFY/issues
// ==/UserScript==`
gulp.task('extension', ['clean:dist', 'extensionEx'], async function () {
  const bundle = await rollup.rollup({
    input: './extension/xhr.js',
    plugins: [
      resolve({ preferBuiltins: false }),
      cmjs(),
      babel({
        exclude: 'node_modules/**',
        presets: [['@babel/preset-env', {
          modules: false,
          targets: '> 3%'
        }]]
      })
    ]
  })

  await bundle.write({
    file: './dist/blhxfy/extension.user.js',
    format: 'umd',
    name: 'blhxfy',
    banner: extensionBanner
  })
})

const extensionBanner2 = `// ==UserScript==
// @name         碧蓝幻想翻译兼容版
// @namespace    https://github.com/biuuu/BLHXFY
// @version      ${extensionVer}
// @description  碧蓝幻想的汉化脚本，提交新翻译请到 https://github.com/biuuu/BLHXFY
// @icon         http://game.granbluefantasy.jp/favicon.ico
// @author       biuuu
// @match        *://game.granbluefantasy.jp/*
// @match        *://gbf.game.mbga.jp/*
// @run-at       document-body
// @grant        none
// @updateURL    https://blhx.danmu9.com/blhxfy/extension.es5.user.js
// @supportURL   https://github.com/biuuu/BLHXFY/issues
// ==/UserScript==`

gulp.task('extensionEx', ['clean:dist'], async function () {
  const bundle = await rollup.rollup({
    input: './extension/xhr.js',
    plugins: [
      resolve({ preferBuiltins: false }),
      cmjs(),
      babel({
        exclude: 'node_modules/**',
        presets: [['@babel/preset-env', {
          modules: false,
          useBuiltIns: 'usage'
        }]]
      })
    ]
  })

  await bundle.write({
    file: './dist/blhxfy/extension.es5.user.js',
    format: 'umd',
    name: 'blhxfy',
    banner: extensionBanner2
  })
})

gulp.task('default', [
  'move:static',
  'move:normalcsv',
  'move:scenario',
  'move:skill',
  'md5',
  'pack',
  'scenarioMap',
  'skillMap',
  'clean:dist',
  'cname',
  'publish'
])
