var gulp = require('gulp');
var path = require('path');
var sourcemaps = require('gulp-sourcemaps');
var ts = require('gulp-typescript');
var del = require('del');
var concat = require('gulp-concat');
var runSequence = require('run-sequence');


var paths = {
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
    ]
};

// SERVER
gulp.task('clean', function(){
    return del('dist')
});

gulp.task('build:server', function () {
	var tsProject = ts.createProject('server/tsconfig.json');
    var tsResult = gulp.src('server/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject));
	return tsResult.js
        .pipe(concat('server.js'))
        .pipe(sourcemaps.write()) 
		.pipe(gulp.dest('dist'))
});


// CLIENT
gulp.task('build:libs', function(){
    var mappedPaths = paths.jsNPMDependencies.map(file => path.resolve('node_modules', file));
    
    var copyJsNPMDependencies = gulp.src(mappedPaths, {base: 'node_modules'})
        .pipe(gulp.dest('dist/public/libs'));
     
    var copyEnv = gulp.src(['.env', 'Procfile'])
        .pipe(gulp.dest('dist'));

    return [copyJsNPMDependencies, copyEnv];
});

gulp.task('build:ts', function(){
    return gulp.src(paths.ts)
        .pipe(sourcemaps.init())
        .pipe(ts(ts.createProject('client/tsconfig.json')))
        .pipe(sourcemaps.write())
		.pipe(gulp.dest('dist'))
});

gulp.task('build:templates', function(){
    return gulp.src(paths.html)
        .pipe(gulp.dest('dist'))
});

gulp.task('build:styles', function(){
    return gulp.src(paths.css)
        .pipe(gulp.dest('dist/public/css'))
});

gulp.task('build:images', function(){
    return gulp.src(paths.img)
        .pipe(gulp.dest('dist/public/img'))
});

gulp.task('watch', function() {
    gulp.watch(paths.ts, ['build:ts']);
    gulp.watch(paths.css, ['build:styles']);
    gulp.watch(paths.html, ['build:templates']);
});


gulp.task('build', function(callback){
    runSequence('clean', 'build:server', 'build:libs', 'build:ts', 'build:templates', 'build:styles', 'build:images', callback);
});

gulp.task('default', ['build', 'watch']);