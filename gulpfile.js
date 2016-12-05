'use strict'

const gulp = require('gulp')
const plugins = require('gulp-load-plugins')()
const argv = require('yargs').argv

gulp.task('cover', () => {
  return gulp.src('./lib/**/*.js')
    .pipe(plugins.istanbul())
})

gulp.task('test', ['cover'], () => {
  return gulp.src('./spec/**/*[sS]pec.js')
    .pipe(plugins.mocha({
      timeout: 18000,
      grep: argv.grep
    }))
    .pipe(plugins.istanbul.writeReports())
})
