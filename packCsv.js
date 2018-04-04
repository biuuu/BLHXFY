const gulp = require('gulp')
const md5File = require('md5-file')
const del = require('del')
const asar = require('asar')
const fs = require('fs-extra')
const CSV = require('papaparse')
const path = require('path')
const ghpages = require('gh-pages')
const { writeFile } = require('./utils/')
const CONFIG = require('./config')

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
          return {
            id: item.id,
            trans: item.trans
          }
        })
        const newStr = CSV.unparse(newList)
        const newBuffer = Buffer.from(newStr)
        // 或者, 你可以这样处理：
        file.contents = newBuffer
        return callback(null, file)
    }
});
};

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

gulp.task('manifest', ['move:scenario'], function (done) {
  fs.writeJson('./dist/blhxfy/data/manifest.json', scenarioMap, done)
})

gulp.task('pack', ['move:static', 'move:normalcsv', 'move:scenario', 'manifest', 'cname'], function (done) {
  asar.createPackage('./dist/blhxfy/data/', './dist/blhxfy/data.asar', done)
})

gulp.task('md5', ['pack'], function (done) {
  md5File('./dist/blhxfy/data.asar', (err, hash) => {
    if (err) throw err
    fs.copy('./dist/blhxfy/data.asar', `./dist/blhxfy/data.${hash.slice(0,5)}.asar`, () => {
      fs.writeJson('./dist/blhxfy/manifest.json', { filename: `data.${hash.slice(0,5)}.asar` }, () => {
        fs.remove('./dist/blhxfy/data.asar', done)
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

gulp.task('default', ['move:static', 'move:normalcsv', 'move:scenario', 'md5', 'pack', 'manifest', 'clean:dist', 'publish', 'cname']);