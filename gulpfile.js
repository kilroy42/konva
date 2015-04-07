var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var replace = require('gulp-replace');
var jshint = require('gulp-jshint');
var mochaPhantomJS = require('gulp-mocha-phantomjs');
var jsdoc = require('gulp-jsdoc');
var connect = require('gulp-connect');

var fs = require('fs');
var NodeParams = fs.readFileSync('./resources/doc-includes/NodeParams.txt').toString();
var ContainerParams = fs.readFileSync('./resources/doc-includes/ContainerParams.txt').toString();
var ShapeParams = fs.readFileSync('./resources/doc-includes/ShapeParams.txt').toString();

var conf = require('./package.json');

var sourceFiles = [
    // core
    'src/Global.js',
    'src/Util.js',
    'src/Canvas.js',
    'src/Context.js',
    'src/Factory.js',
    'src/Node.js',

    // filters
    'src/filters/Grayscale.js',
    'src/filters/Brighten.js',
    'src/filters/Invert.js',
    'src/filters/Blur.js',
    'src/filters/Mask.js',
    'src/filters/RGB.js',
    'src/filters/HSV.js',
    'src/filters/HSL.js',
    'src/filters/Emboss.js',
    'src/filters/Enhance.js',
    'src/filters/Posterize.js',
    'src/filters/Noise.js',
    'src/filters/Pixelate.js',
    'src/filters/Threshold.js',
    'src/filters/Sepia.js',
    'src/filters/Solarize.js',
    'src/filters/Kaleidoscope.js',

    // core
    'src/Animation.js',
    'src/Tween.js',
    'src/DragAndDrop.js',
    'src/Container.js',
    'src/Shape.js',
    'src/Stage.js',
    'src/BaseLayer.js',
    'src/Layer.js',
    'src/FastLayer.js',
    'src/Group.js',

    // shapes
    'src/shapes/Rect.js',
    'src/shapes/Circle.js',
    'src/shapes/Ellipse.js',
    'src/shapes/Ring.js',
    'src/shapes/Wedge.js',
    'src/shapes/Arc.js',
    'src/shapes/Image.js',
    'src/shapes/Text.js',
    'src/shapes/Line.js',
    'src/shapes/Sprite.js',

    // plugins
    'src/plugins/Path.js',
    'src/plugins/TextPath.js',
    'src/plugins/RegularPolygon.js',
    'src/plugins/Star.js',
    'src/plugins/Label.js',
    'src/plugins/Arrow.js'
];

function build() {
    return gulp.src(sourceFiles)
        .pipe(concat('konva-dev.js'))
        .pipe(replace('@@shapeParams', ShapeParams))
        .pipe(replace('@@nodeParams', NodeParams))
        .pipe(replace('@@containerParams', ContainerParams))
        .pipe(replace('@@version', conf.version))
        .pipe(replace('@@date', new Date().toDateString()));
}

// Basic usage
gulp.task('dev-build', function() {
        build()
//        .pipe(uglify())
        .pipe(gulp.dest('./dist/'));
});

gulp.task('build', function() {
    return build()
        .pipe(rename('konva.js'))
        .pipe(gulp.dest('./'))
        .pipe(uglify({
            preserveComments : 'some'
        }))
        .pipe(rename('konva.min.js'))
        .pipe(gulp.dest('./'));
});

gulp.task('test', ['dev-build'], function () {
    return gulp
        .src('test/runner.html')
        .pipe(mochaPhantomJS());
});

gulp.task('server', function() {
    connect.server();
});

gulp.task('lint', function() {
    return gulp.src('./src/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('api', function() {
    return gulp.src('./src/**/*.js')
        .pipe(jsdoc('./api'));
});

gulp.task('watch', function() {
    gulp.watch(['src2/**/*.ts'], ['dev-build']);
});


gulp.task('default', ['dev-build', 'watch', 'server']);