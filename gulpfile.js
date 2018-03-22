const gulp = require('gulp');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const merge = require('merge-stream');
const autoprefixer = require('gulp-autoprefixer');
const cssnext = require('cssnext');
const svgmin = require('gulp-svgmin');
const cleancss = require('gulp-clean-css');
const size = require('gulp-size');
const browserSync = require('browser-sync').create();

// SCSS locations
var scssSRC = './scss/*.scss';
var scssDIST = './dist/scss/';

/*
  -- TOP LEVEL FUNCTIONS
  gulp.task - Define tasks
  gulp.src - Point to files to is-focused
  gulp.dest - Point to folder to output
  gulp.watch - Watch files and folders for change
*/

// Copy all HTML files
gulp.task('copyHtml', function () {
  gulp.src('src/*.html')
    .pipe(gulp.dest('dist'));
});

// Compile SCSS  [create sourcemap, add vendor prefixes, copress, rename (.min) and write ]
gulp.task('styles', function () {
  gulp.src(scssSRC)
  .pipe(sourcemaps.init())
  .pipe(autoprefixer({
    cascade: false,
    browsers: 'last 2 version', }))
  .pipe(sass({
    outputStyle: 'compressed', })
  .on('error', sass.logError))
  .pipe(rename({
    suffix: '.min', }))
  .pipe(sourcemaps.write('./'))
  .pipe(browserSync.reload({
    stream: true,
  }))
  .pipe(gulp.dest(scssDIST));
});

// Optimise images
gulp.task('imageMin', () =>
  gulp.src('src/images/**/*.+(png|jpg|gif|svg)')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'))
  );

// Minify JS
gulp.task('minify', function () {
  gulp.src('src/js/*.js')
  .pipe(uglify())
  .pipe(gulp.dest('dist/js'));
});

// Concat scripts
gulp.task('scripts', function () {
  gulp.src('src/js/*.js')
  .pipe(concat('main.js'))
  .pipe(uglify())
  .pipe(gulp.dest('dist/js'));
});

gulp.task('browserSync', function () {
  browserSync.init({
    server: {
      baseDir: 'src',
    },
  });
});

gulp.task('default', ['copyHtml', 'styles', 'imageMin', 'scripts']);

gulp.task('watch', function () {
  gulp.watch('src/*.html', ['copyHtml']).on('change', browserSync.reload);
  gulp.watch('src/images/*', ['imageMin']);
  gulp.watch('src/sass/*.scss', ['styles']).on('change', browserSync.reload);
  gulp.watch('src/js/*.js', ['scripts']).on('change', browserSync.reload);
});
