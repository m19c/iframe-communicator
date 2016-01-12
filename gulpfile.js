const gulp = require('gulp');
const eslint = require('gulp-eslint');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const sequence = require('gulp-sequence');
const del = require('del');

gulp.task('lint', () => {
  return gulp
    .src(['index.js', 'example/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
  ;
});

gulp.task('clean', () => {
  return del(['dist/*.js']);
});

gulp.task('minify', function minify() {
  return gulp
    .src(['dist/*.js'])
    .pipe(uglify({
      mangle: false,
      compress: true
    }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist'))
  ;
});

gulp.task('distribute', () => {
  return gulp
    .src(['index.js'])
    .pipe(rename('ic.js'))
    .pipe(gulp.dest('dist/'))
  ;
});

gulp.task('build', (done) => sequence('clean', 'distribute', 'minify')(done));

gulp.task('dev', () => {
  return gulp.watch(['index.js'], ['build']);
});
