'use strict';

var gulp    = require('gulp')
 , plugins = require('gulp-load-plugins')()
 , argv    = require('yargs').argv;

gulp.task('lint', function() {
  return gulp.src(['./lib/**/*.js', './spec/**/*[sS]pec.js', 'gulpfile.js'])
    .pipe(plugins.jshint('.jshintrc'))
    .pipe(plugins.jshint.reporter('jshint-stylish'));
});

gulp.task('cover', function() {
  return gulp.src('./lib/**/*.js')
    .pipe(plugins.istanbul());
});

gulp.task('test', ['cover'], function () {
  return gulp.src('./spec/**/*[sS]pec.js')
    .pipe(plugins.mocha({
      timeout: 18000,
      grep: argv.grep
    }))
    .pipe(plugins.istanbul.writeReports());
});
