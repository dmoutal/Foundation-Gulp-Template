// Include gulp
var gulp = require('gulp'); 

// Include Plugins
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var filter = require('gulp-filter');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');

//Start Browser Sync server
gulp.task('browser-sync', function() {
    browserSync({
        proxy: "dev.dev"
    });
});

// Reload all Browsers
gulp.task('reload', function () {
    browserSync.reload();
});

// Compile Sass
gulp.task('sass', function() {
    return gulp.src('scss/*.scss')
        .pipe(sourcemaps.init())
            .pipe(sass({ outputStyle: 'compressed' }))
            .pipe(prefix({browser:[ '> 1%, last 3 versions, ff ESR' ]}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('.'))
        .pipe(filter('*.css')) // Filtering stream to only css files
        .pipe(reload({stream:true}));
});

// Lint Task
gulp.task('lint', function() {
    return gulp.src('js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Locations of JS files
var scriptsrc = [
                    'scripts/*.js'
                ]

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src(scriptsrc)
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('.'))
        .pipe(rename('scripts.min.js'))
        .pipe(sourcemaps.init())
            .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('.'));
});

// Watch Files For Changes
gulp.task('watch', ['default', 'browser-sync'], function() {
    gulp.watch(scriptsrc, ['lint', 'scripts', 'reload']);
    gulp.watch('scss/*.scss', ['sass']);
    gulp.watch("*.php", ['reload']);
});

// Default Task
gulp.task('default', ['lint', 'sass', 'scripts']);