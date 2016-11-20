var gulp = require('gulp'),
    path = require('path'),
    sourcemaps = require('gulp-sourcemaps'),
    ts = require('gulp-typescript'),
    del = require('del'),
    concat = require('gulp-concat'),
    css = require('gulp-clean-css'),
    runSequence = require('run-sequence'),
    paths = {
        ts: 'client/**/*.ts',
        html: 'client/**/*.html',
        css: 'client/**/*.css',
        img: ['client/**/*.png', 'client/**/*.jpg'],
        jsNPMDependencies: [
            'angular2/bundles/angular2-polyfills.js',
            'systemjs/dist/system.src.js',
            'rxjs/bundles/Rx.js',
            'angular2/bundles/angular2.dev.js',
            'angular2/bundles/router.dev.js'
        ],
        dist: 'dist',
        public: 'dist/public',
        libs: 'dist/public/libs'
    };

// SERVER
gulp.task('clean', function () {
    return del(paths.dist)
});

gulp.task('build:server', function () {
    var tsResult = gulp.src('server/**/*.ts')
            .pipe(sourcemaps.init())
            .pipe(ts.createProject('server/tsconfig.json')());
    return tsResult.js
        .pipe(concat('server.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.dist))
});

// CLIENT
gulp.task('build:libs', function () {
    var mappedPaths = paths.jsNPMDependencies.map(file => path.resolve('node_modules', file));

    var dep = gulp.src(mappedPaths, {base: 'node_modules'})
        .pipe(gulp.dest(paths.libs));

    var env = gulp.src(['.env', 'Procfile'])
        .pipe(gulp.dest(paths.dist));

    return [dep, env];
});

gulp.task('build:ts', function () {
    return gulp.src(paths.ts)
        .pipe(sourcemaps.init())
        .pipe(ts.createProject('client/tsconfig.json')())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.dist))
});

gulp.task('build:templates', function () {
    return gulp.src(paths.html)
        .pipe(gulp.dest(paths.dist))
});

gulp.task('build:styles', function () {
    return gulp.src(paths.css)
        .pipe(css())
        .pipe(gulp.dest(paths.public))
});

gulp.task('build:images', function () {
    return gulp.src(paths.img)
        .pipe(gulp.dest(paths.public))
});

gulp.task('watch', function () {
    gulp.watch(paths.ts, ['build:ts']);
    gulp.watch(paths.css, ['build:styles']);
    gulp.watch(paths.html, ['build:templates']);
});


gulp.task('build', function (callback) {
    runSequence('clean', 'build:server', 'build:libs', 'build:ts', 'build:templates', 'build:styles', 'build:images', callback);
});


gulp.task('default', ['build', 'watch']);