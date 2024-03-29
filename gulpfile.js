const gulp = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const rename = require('gulp-rename')
const cleanCSS = require('gulp-clean-css')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')
const sourcemaps = require('gulp-sourcemaps')
const autoprefixer = require('gulp-autoprefixer')
const imagemin = require('gulp-imagemin')
const htmlmin = require('gulp-htmlmin')
const newer = require('gulp-newer')
const browsersync = require('browser-sync')
const del = require('del')

const paths = {
  html: {
    src: 'src/*.html',
    dest: 'dist/'
  },
  styles: {
    src: ['src/styles/**/*.sass', 'src/styles/**/*.scss'],
    dest: 'dist/css/'
  },
  scripts: {
    src: 'src/scripts/**/*.js',
    dest: 'dist/js/'
  },
  images: {
    src: 'src/img/**',
    dest: 'dist/img'
  }
}

function clean() {
  return del(['dist/*', '!dist/img'])
}

function html() {
  return gulp.src(paths.html.src)
  .pipe(htmlmin({
    collapseWhitespace: true
  }))
  .pipe(gulp.dest(paths.html.dest))
  .pipe(browsersync.stream())
}

function styles() {
  return gulp.src(paths.styles.src)
  .pipe(sourcemaps.init())
  .pipe(sass().on('error',sass.logError))
  .pipe(autoprefixer({
    cascade: false
  }))
  .pipe(cleanCSS({
    level: 2
  }))
  .pipe(rename({
    basename: 'main',
    suffix: '.min'
  }))
  .pipe(sourcemaps.write(''))
  .pipe(gulp.dest(paths.styles.dest))
  .pipe(browsersync.stream())
}

function scripts() {
  return gulp.src(paths.scripts.src)
  .pipe(sourcemaps.init())
  .pipe(babel({
    presets: ['@babel/env']
  }))
  .pipe(uglify())
  .pipe(concat('main.min.js'))
  .pipe(sourcemaps.write(''))
  .pipe(gulp.dest(paths.scripts.dest))
  .pipe(browsersync.stream())
}

function img() {
  return gulp.src(paths.images.src)
  .pipe(newer(paths.images.dest))
  .pipe(imagemin({
    progressive: true
  }))
  .pipe(gulp.dest(paths.images.dest))
}

function watch() {
  browsersync.init({
    server: {
      baseDir: './dist/'
    }
  })
  gulp.watch(paths.html.dest).on('change', browsersync.reload)
  gulp.watch(paths.html.src, html)
  gulp.watch(paths.styles.src, styles)
  gulp.watch(paths.scripts.src, scripts)
  gulp.watch(paths.images.dest, img)
}

const build = gulp.series(clean, html, gulp.parallel(styles, scripts, img), watch)

exports.clean = clean
exports.img = img
exports.html = html
exports.styles = styles
exports.scripts = scripts
exports.watch = watch
exports.build = build
exports.default = build