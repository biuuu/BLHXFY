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

const through = require('through2')

const scenarioMap = {}

const collectCsv = function() {
  return through.obj(function(file, encoding, callback) {
    if (file.isNull()) {
        return callback(null, file);
    }

    if (file.isStream()) {
        this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported!'));
    } else if (file.isBuffer()) {
        const str = file.contents.toString()
        const list = CSV.parse(str.replace(/^\ufeff/, ''), { header: true }).data
        const newList = list.map(item => {
          if (item.id === 'info') {
            scenarioMap[item.trans] = path.basename(file.path)
          }
          return item
        })
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

gulp.task('move:scenario', ['clean:dist'], function () {
  return gulp.src('./data/scenario/**/*.csv')
    .pipe(collectCsv())
    .pipe(gulp.dest('./dist/blhxfy/data/scenario/'))
})

gulp.task('scenarioMap', ['move:scenario'], function (done) {
  fs.writeJson('./dist/blhxfy/data/scenario.json', scenarioMap, done)
})

gulp.task('pack', ['move:static', 'move:normalcsv', 'move:scenario', 'scenarioMap', 'cname'], function () {
  // asar.createPackage('./dist/blhxfy/data/', './dist/blhxfy/data.asar', done)
  return gulp.src('dist/blhxfy/data/**/*')
    .pipe(zip('data.zip'))
    .pipe(gulp.dest('dist/blhxfy/'))
})

gulp.task('md5', ['pack'], function (done) {
  md5File('./dist/blhxfy/data.zip', (err, hash) => {
    if (err) throw err
    fs.copy('./dist/blhxfy/data.zip', `./dist/blhxfy/data.${hash.slice(0,5)}.zip`, () => {
      fs.writeJson('./dist/blhxfy/manifest.json', { packname: `data.${hash.slice(0,5)}.zip` }, () => {
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

gulp.task('default', ['move:static', 'move:normalcsv', 'move:scenario', 'md5', 'pack', 'scenarioMap', 'clean:dist', 'publish', 'cname']);