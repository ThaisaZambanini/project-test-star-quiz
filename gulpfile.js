const gulp = require('gulp')
const sass = require('gulp-sass')
const concat = require('gulp-concat')
const runSequence = require('run-sequence')
const del = require('del')
const minify = require('gulp-minify');

const vendor = {
  js: {
    dest: 'build/vendors/js/',
    src: [
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/popper.js/dist/umd/popper.min.js',
      'node_modules/bootstrap/dist/js/bootstrap.min.js',
      'node_modules/ejs/ejs.min.js',
      'node_modules/axios/dist/axios.min.js'
    ]
  },
  css: {
    dest: 'build/vendors/css/',
    src: [
      'node_modules/bootstrap/dist/css/bootstrap.min.css'
    ]
  }
}

const images = {
  dest: 'build/images/',
  src: [
    'public/images/**'
  ]
}

const js = {
  dest: 'build/js/',
  src: [
    'public/js/**'
  ]
}

/* VENDOR */
gulp.task('copy:vendor', ['copy:vendor:js', 'copy:vendor:css'])

gulp.task('copy:vendor:js', () => {
  return gulp.src(vendor.js.src)
    .pipe(concat('vendors.js'))
    .pipe(gulp.dest(vendor.js.dest))
})

gulp.task('copy:vendor:css', () => {
  return gulp.src(vendor.css.src)
    .pipe(concat('styles.css'))
    .pipe(gulp.dest(vendor.css.dest))
})

/* SASS */
gulp.task('sass', () => {
  return gulp.src([
    'public/css/*.scss'
  ])
  .pipe(sass({outputStyle: 'compressed'}))
  .pipe(gulp.dest('build/css/'))
})

/* IMAGES */
gulp.task('images', () => {
  return gulp.src(images.src)
    .pipe(gulp.dest(images.dest))
})

/* JS */
gulp.task('js', () => {
  return gulp.src(js.src)
    .pipe(minify())
    .pipe(gulp.dest(js.dest))
})

gulp.task('build-clean', function () {
  return del(['build/**'])
})

/* START DEFAULT */
gulp.task('deploy', function () {
  runSequence('build-clean', ['sass', 'copy:vendor', 'images', 'js'])
})
