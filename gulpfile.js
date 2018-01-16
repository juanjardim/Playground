var fs = require('fs');
var gulp = require('gulp');
var sass = require('gulp-sass');
var nodemon = require('gulp-nodemon');
var notify = require('gulp-notify');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');

var options = {
    lightningPath: '../src/aura/',
    sassPath: '../Styles/**/*.scss',
    cssPath: '../Styles/css/',
    styles: 'public/styles',
    public: 'public/**/*.*'
}


gulp.task('sass', () => {
    console.log("executing sass transformation");
    return gulp.src(options.sassPath)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(options.cssPath))
});

gulp.task('dist', () => {
    console.log("executing dist");
    return gulp.src(options.cssPath + "*.css")
        .pipe(rename((path) => {
            path.dirname = "/" + path.basename
        }))
        .pipe(gulp.dest(options.lightningPath));
});

gulp.task('sass-in-playground', () => {
    console.log("executing sass transformation in playground");
    return gulp.src(options.sassPath)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(options.cssPath))
});

gulp.task('put-in-playground', () => {
    console.log("put-in-playground");
    return gulp.src(options.cssPath + "*.css")
        .pipe(gulp.dest(options.styles));
});

gulp.task('sass:watch', () => {
    gulp.watch(options.sassPath, function(callback) {
        runSequence('sass', ['dist', 'put-in-playground']);
      });
});

gulp.task('html:watch', () =>{
    gulp.watch(options.public, function(){
        gulp.src(options.public)
        .pipe(livereload())
        .pipe(notify('Reloading page, please wait'))
    })
})

gulp.task('nodemon', (cb) =>{
    var started = false;
    return nodemon({
        script: 'server.js',
    }).on('start', function(){
        if(!started){
            cb();
            started = true;
        }
    });
})

gulp.task('browser-sync', ['nodemon'], () =>{
    browserSync.init(null,{
        proxy: 'http://localhost:8080',
        files: [options.public],
        browser: "chrome",
        port: 7000
    });
})

gulp.task('default', ['browser-sync', 'sass:watch']);