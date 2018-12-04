const gulp = require("gulp4");
const less = require("gulp-less");
const babel = require("gulp-babel");
const rename = require("gulp-rename");
const pug = require('gulp-pug');
const cleanCSS = require("gulp-clean-css");
const minify = require("gulp-uglify");
const cleanHTML = require("gulp-minify-html");
const del = require('del');

const clean = () => {
    return del(["build"]);
};

const stylesless = () => {
    return gulp.src('public/**/**/*.less')
        .pipe(less())
        .pipe(cleanCSS())
        .pipe(rename({
            dirname: 'css',
            suffix: '.min'
        }))
        .pipe(gulp.dest('build/'));
};

const stylescss = () => {
    return gulp.src('public/**/**/*.css')
        .pipe(cleanCSS())
        .pipe(rename({
            dirname: 'css',
            suffix: '.min'
        }))
        .pipe(gulp.dest('build/'));
};

const code = () => {
    return gulp.src('public/**/*.js ')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        //.pipe(minify())
        .pipe(gulp.dest('build/'))
};

const views = () => {
    return gulp.src('views/*.pug')
        .pipe(pug())
        .pipe(cleanHTML())
        .pipe(rename({
            dirname: 'html'
        }))
        .pipe(gulp.dest('build/'))
};

const bin = () => {
    return gulp.src('bin/**')
        .pipe(gulp.dest('build/bin/'));
};

const routes = () => {
    return gulp.src('routes/**')
        .pipe(gulp.dest('build/routes/'));
};

const libraries = () => {
    return gulp.src('lib/**')
        .pipe(gulp.dest('build/lib/'))
};

const res = () => {
    return gulp.src('public/resources/**')
        .pipe(gulp.dest('build/res/'))
};

const data = () => {
    return gulp.src('data/**')
        .pipe(gulp.dest('build/data/'))
};

const ssl = () => {
    return gulp.src('ssl/**')
        .pipe(gulp.dest('build/ssl/'));
};

gulp.task("clean", gulp.series(clean));
gulp.task("build", gulp.parallel(stylesless, stylescss, code, views, res, data, libraries, ssl, bin, routes));
gulp.task("default", gulp.series("clean", "build"));