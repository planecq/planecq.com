var exec = require('child_process').exec;
var path = require('path');
var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var rename = require('gulp-rename');
var htmlmin = require('gulp-htmlmin');
var size = require('gulp-size');
var gutil = require('gulp-util');
var bootlint  = require('gulp-bootlint');

var watching = false;
var config = {
  scssFile: 'assets/custom/scss/style.scss',
  cssFiles: [
    'assets/vendor/bootstrap/css/bootstrap.css',
    'assets/vendor/fontawesome/css/font-awesome.css',
    'assets/vendor/novecento/css/novecento-font.css',
    'assets/vendor/rs-plugin/css/settings.css',
    'assets/vendor/rs-plugin/css/extralayers.css',
    'assets/custom/scss/style.css'
  ],
  jsFiles: [
    'assets/vendor/jquery/js/jquery-1.10.1.min.js',
    'assets/vendor/bootstrap/js/bootstrap.min.js',
    'assets/vendor/sticky/js/jquery.sticky.js',
    'assets/vendor/mousewheel/js/jquery.mousewheel-3.0.6.pack.js',
    'assets/vendor/superfish/js/hoverIntent.js',
    'assets/vendor/superfish/js/superfish.js',
    'assets/vendor/superfish/js/supersubs.js',
    'assets/vendor/flickity/js/flickity.pkgd.min.js',
    'assets/vendor/rs-plugin/js/jquery.themepunch.tools.min.js',
    'assets/vendor/rs-plugin/js/jquery.themepunch.revolution.min.js',
    'assets/vendor/stellar/js/jquery.stellar.min.js',
    'assets/vendor/imagesloaded/js/imagesloaded.pkgd.min.js',
    'assets/vendor/modernizr/js/modernizr.js',
    'assets/vendor/jquery-easing/js/jquery.easing.min.js',
    'assets/vendor/retina/js/retina.min.js',
    'assets/custom/js/script.js'
  ],
  htmlFiles: [
    'index.html'
  ],
  gulpFolder: './gulp'
};

// Compile scss file
gulp.task('sass', function() {
  return gulp.src(config.scssFile)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('style.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.dirname(config.scssFile)));
});

// Watch version of the scss compilation
gulp.task('sass:watch', function() {
  watching = true;
  gulp.watch(config.scssFile, ['sass']);
});

// Concatenate and minify css assets with sourcemaps
gulp.task('minify:css', function() {
  var bef = size({title: 'all.css'});
  var aft = size({title: 'all.min.css'});
  return gulp.src(config.cssFiles)
    .pipe(bef)
    .pipe(sourcemaps.init())
    .pipe(cleanCSS({
      relativeTo: config.gulpFolder,
      target: config.gulpFolder,
      advanced: !watching
    }))
    .pipe(concat('all.min.css'))
    .pipe(aft)
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.gulpFolder))
    .on('finish', function() {
      gutil.log('CSS Compression: ' + Math.round((bef.size - aft.size) / bef.size * 100) + '%');
    });
});

// Watch version of css minification
gulp.task('minify:css:watch', function() {
  watching = true;
  gulp.watch(config.cssFiles, ['minify:css']);
});

// Concatenate and minify js assets with sourcemaps
gulp.task('minify:js', function() {
  var bef = size({title: 'all.js'});
  var aft = size({title: 'all.min.js'});
  return gulp.src(config.jsFiles)
    .pipe(bef)
    .pipe(sourcemaps.init())
    .pipe(gulpif(!watching, uglify()))
    .pipe(concat('all.min.js'))
    .pipe(aft)
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.gulpFolder))
    .on('finish', function() {
      gutil.log('JS Compression: ' + Math.round((bef.size - aft.size) / bef.size * 100) + '%');
    });
});

// Watch version of js minification
gulp.task('minify:js:watch', function() {
  watching = true;
  gulp.watch(config.jsFiles, ['minify:js']);
});

// Minify html
gulp.task('minify:html', function() {
  var bef = size({title: 'index.html'});
  var aft = size({title: 'index.min.html'});
  return gulp.src(config.htmlFiles)
    .pipe(bef)
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(rename(function(path) {
      path.basename += '.min';
    }))
    .pipe(aft)
    .pipe(gulp.dest('.'))
    .on('finish', function() {
      gutil.log('HTML Compression: ' + Math.round((bef.size - aft.size) / bef.size * 100) + '%');
    });
});

// Watch version of html minification
gulp.task('minify:html:watch', function() {
  watching = true;
  gulp.watch(config.htmlFiles, ['minify:html']);
});

// Validate html, links, etc.
gulp.task('html-proofer', function(done) {
  execute('htmlproofer ./index.html --check-html --check-favicon --check-external-hash', {}, done);
});

// Validate bootstrap
gulp.task('bootlint', function() {
  return gulp.src('./index.html')
    .pipe(bootlint({
      stoponerror: true
    }));
});

// Full test task
gulp.task('test', ['html-proofer', 'bootlint']);

// Combine all watch tasks for development
gulp.task('watch:all', ['sass:watch', 'minify:css:watch', 'minify:js:watch', 'minify:html:watch']);

// Util to execute external command
function execute(cmd, opts, done) {
  console.log(cmd);
  exec(cmd, opts, function(error, stdout, stderr) {
    console.log(stdout);
    console.error(stderr);
    done(error);
  });
}
