var gulp = require('gulp');
var path = require('path');
var sourcemaps = require('gulp-sourcemaps');
var ts = require('gulp-typescript');
var del = require('del');
var concat = require('gulp-concat');
var runSequence = require('run-sequence');

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

/*
 jsNPMDependencies, sometimes order matters here! so becareful!
 */
var jsNPMDependencies = [
    'angular2/bundles/angular2-polyfills.js',
    'systemjs/dist/system.src.js',
    'rxjs/bundles/Rx.js',
    'angular2/bundles/angular2.dev.js',
    'angular2/bundles/router.dev.js'
];

gulp.task('build:libs', function(){
    var mappedPaths = jsNPMDependencies.map(file => path.resolve('node_modules', file));
    
    //Let's copy our head dependencies into a dist/libs
    var copyJsNPMDependencies = gulp.src(mappedPaths, {base: 'node_modules'})
        .pipe(gulp.dest('dist/public/libs'));
     
    //Let's copy our index into dist   
    var copyIndex = gulp.src('client/index.html')
        .pipe(gulp.dest('dist'));

    var copyEnv = gulp.src(['.env', 'Procfile'])
        .pipe(gulp.dest('dist'));

    return [copyJsNPMDependencies, copyIndex, copyEnv];
});

gulp.task('build:ts', function(){
    var tsProject = ts.createProject('client/tsconfig.json');
    var tsResult = gulp.src('client/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(ts(tsProject));
	return tsResult.js
        .pipe(sourcemaps.write()) 
		.pipe(gulp.dest('dist'))
});

gulp.task('build:templates', function(){
    return gulp.src('client/**/*.html')
        .pipe(gulp.dest('dist'))
});

gulp.task('build:styles', function(){
    return gulp.src('client/css/**/*.css')
        .pipe(gulp.dest('dist/public/css'))
});

gulp.task('build:images', function(){
    return gulp.src(['client/img/**/*.png', 'client/img/**/*.jpg'])
        .pipe(gulp.dest('dist/public/img'))
});

gulp.task('watch', function() {
    gulp.watch('client/**/*.ts', ['build:ts']);
    gulp.watch('client/**/*.css', ['build:styles']);
    gulp.watch('client/**/*.html', ['build:templates']);
});


gulp.task('build', function(callback){
    runSequence('clean', 'build:server', 'build:libs', 'build:ts', 'build:templates', 'build:styles', 'build:images', callback);
});

gulp.task('default', ['build', 'watch']);