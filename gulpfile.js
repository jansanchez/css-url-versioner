/*!!
 * 
 * gulpfile.js
 * @author: Jan Sanchez
 *
 */

var gulp = require('gulp'),
changelog = require('conventional-changelog'),
bump = require('gulp-bump'),
tagVersion = require('gulp-tag-version'),
filter = require('gulp-filter'),
del = require('del'),
fs = require('fs'),
loadPlugins = require('gulp-load-plugins'),
package = require('./package.json'),
notifier = require("node-notifier"),
path = require('./gulp/path'),
options = require('./gulp/options');

var plugins = loadPlugins();

plugins.runSequence = require('run-sequence');

var coffeeTasks = ['js'];


/*!!
* 
* Tareas para changelog, tag
*
* tarea principal: gulp
*/


gulp.task('log', function () {
    return changelog({
        repository: package.repository.url,
        version: package.version
    }, function(err, log) {
        fs.writeFileSync('CHANGELOG.md', log, 'utf8');
    });
});

gulp.task('bump', function(){
    return gulp.src(['./package.json'])
    .pipe(bump())
    .pipe(gulp.dest('./'))
    .pipe(filter('package.json'))
    .pipe(tagVersion());
});

gulp.task('version', function (cb) {
    plugins.runSequence(['log', 'bump'], cb);
});

/*!!
* 
* Tareas individuales para limpiar los archivos generados
*
* tarea principal: gulp clean
*/

gulp.task('clean:js:package', function (cb) {
    return del(path.clean.js.package, cb());
});

gulp.task('clean:js:test', function (cb) {
    return del(path.clean.js.test, cb());
});

gulp.task('clean:js:pretest', function (cb) {
    return del(path.clean.js.pretest, cb());
});

gulp.task('clean:js', function (cb) {
    return plugins.runSequence(['clean:js:package', 'clean:js:test', 'clean:js:pretest'], cb);
});

gulp.task('clean', function (cb) {
    plugins.runSequence(['clean:js'], cb);
});


/*!!
* 
* Tareas para copiar archivos
*
* tarea principal: gulp copy
*/

gulp.task('copy:js:test', function () {
    gulp.src(path.copy.js.test.src, {
            base: path.copy.js.test.base
        })
        .pipe(gulp.dest(path.copy.js.test.dest));
});


/*!!
* 
* Tareas para generar, concatenar, lintear Javascript
*
* tarea principal: gulp js
*/

gulp.task('coffee', function() {
    return gulp.src(path.coffee.default.src)
    .pipe(plugins.coffee(options.coffee.general).on('error', function(err){
        console.log('');
        console.log(err.name + " in " + err.plugin);
        console.log('Message: ' + err.message);
        console.log('Stack: ' + err.stack);

        var isLinux = /^linux/.test(process.platform);
        if (isLinux){
            notifier.notify({
                title: 'Plugin: ' + err.plugin,
                message: err.name + ' in ' + err.plugin,
                contentImage: __dirname + "/gulp/img/logo.png",
                appIcon: __dirname + "/gulp/img/logo.png",
                open: "file://" + __dirname + "/gulp/img/logo.png"
            }, function(error, response) {
                console.log(response);
            });
        }

    }))
    .pipe(gulp.dest(path.coffee.default.dest));
});


gulp.task('lint', function() {
    return gulp.src(path.javascript.lint)
        .pipe(plugins.jshint(options.js.lint.jshintrc))
        .pipe(plugins.jshint.reporter(options.js.lint.reporterStyle))
        .pipe(plugins.jshint.reporter(options.js.lint.reporter));
});


gulp.task('complexity', function(){
    return gulp.src(path.javascript.complexity)
    .pipe(plugins.complexity({breakOnErrors: false}));
});


gulp.task('js', function(cb) {
    plugins.runSequence('clean:js', 'coffee', 'copy:js:test', 'lint', 'clean:js:pretest', cb);
});


gulp.task('watch', function () {

    gulp.watch(path.watch.coffee, coffeeTasks);
});


/*!!
* 
* Tareas por default
*
* tarea principal: gulp
*/

gulp.task('default', [], function (cb) {
    plugins.runSequence('js', cb);
});


gulp.task('mocha', function () {
    return gulp.src(path.mocha.js.test, {read: false})
    .pipe(plugins.mocha({
        reporter: 'spec',
        recursive: true,
        globals: {
            should: require('should'),
            assert: require('assert')
        }
    }
    ));
});

/*
* Task for test my package
*/

var cssVersioner = require('./dist/package/index');

gulp.task('versioner', function () {
    fs.readFile('test/css/test.css', 'utf8', function (err, data) {
        var a = cssVersioner({
            content: data,
            lastcommit: true
        });
        console.log(a.output);
    });
});

