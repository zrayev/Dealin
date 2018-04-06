'use strict';

const gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cleanCSS = require('gulp-clean-css'),
    concat = require('gulp-concat'),
    minifyImg = require('gulp-imagemin'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    del = require('del');

var path = {
    build: {
        html: 'build/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    src: {
        html: 'src/*.html',
        styles: 'src/scss/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
        css: 'build/css/*.css'
    }
};

var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 9013,
    logPrefix: "Dealin test web page"
};

function clean() {
    return del(['build']);
}

function html() {
    return gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
}

function styles() {
    return gulp.src(path.src.styles)
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: require('node-normalize-scss').includePaths,
            compress: true
        }))
        .pipe(autoprefixer({
            browsers: ['last 5 versions'],
            cascade: false
        }))
        .pipe(concat('theme.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(cleanCSS())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
}

gulp.task('sass', function () {
    gulp.src('path/to/input.scss')
        .pipe(sass({
            includePaths: require('node-normalize-scss').includePaths
        }))
        .pipe(gulp.dest('path/to/output.css'));
});

function images() {
    return gulp.src(path.src.img)
        .pipe(minifyImg())
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));
}

function fonts() {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
}

exports.clean = clean;
exports.html = html;
exports.styles = styles;
exports.fonts = fonts;
exports.images = images;

var build = gulp.series(clean, gulp.parallel(html, styles, fonts, images));
gulp.task('build', build);

gulp.task('webserver', function () {
    browserSync(config);
});

// Default task
gulp.task('default', gulp.series('build','webserver'));
// gulp.task('default', gulp.task('build'));
