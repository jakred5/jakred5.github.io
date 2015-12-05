var gulp = require('gulp'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    minifyHTML = require('gulp-minify-html'),
    runSequence = require('run-sequence');

gulp.task('default', function() {
    runSequence('index', 'rest', 'minifyIndexExternals', 'minifyRestExternals');
});

gulp.task('minifyIndexExternals', function() {
    return gulp.src('index.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest(''));
});

gulp.task('minifyRestExternals', function() {
    return gulp.src('views/*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest('views'));
});

gulp.task('index', function() {
    return gulp.src('dev/index.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest(''));
});

gulp.task('rest', function() {
    return gulp.src('dev/views/*.html')
        .pipe(useref({ searchPath: ['/', 'dev/views'] }))
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest('views'));
});