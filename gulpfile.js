var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var bootlint  = require('gulp-bootlint');

gulp.task('sass', function() {
  return gulp.src('./assets/custom/scss/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('assets/custom/scss/'));
});

gulp.task('sass:watch', function() {
  gulp.watch('./assets/custom/scss/style.scss', ['sass']);
});

gulp.task('bootlint', function() {
  return gulp.src('./index.html')
    .pipe(bootlint({
      stoponerror: true
    }));
});
