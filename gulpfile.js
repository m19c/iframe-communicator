const gulp = require('gulp');
const eslint = require('gulp-eslint');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const sequence = require('gulp-sequence');
const del = require('del');
const karma = require('karma');

const transpilers = [
  { plugin: 'transform-es2015-modules-amd', suffix: '.amd' },
  { plugin: 'transform-es2015-modules-commonjs', suffix: '' },
  { plugin: 'transform-es2015-modules-systemjs', suffix: '.system' },
  { plugin: 'transform-es2015-modules-umd', suffix: '.umd' }
];

gulp.task('lint', () => {
  return gulp
    .src(['index.js', 'test/**/*.js', 'example/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
  ;
});

gulp.task('test', ['build'], () => {
  return new karma.Server({
    configFile: 'test/karma.config.js',
    singleRun: true
  });
});

gulp.task('clean', () => {
  return del(['dist/*.js']);
});

transpilers.forEach(function eachTranspiler(transpiler) {
  gulp.task(`transpile.${transpiler.plugin}`, function transpilerTask() {
    return gulp
      .src(['index.js'])
      .pipe(babel({
        plugins: [transpiler.plugin]
      }))
      .pipe(rename(`ic${transpiler.suffix}.js`))
      .pipe(gulp.dest('dist'))
    ;
  });
});

gulp.task('transpile', transpilers.map((transpiler) => `transpile.${transpiler.plugin}`));

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

gulp.task('build', sequence('clean', 'transpile', 'minify'));
