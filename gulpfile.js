const {src, dest, series, parallel, task, watch} = require('gulp'),
      browserSync = require('browser-sync'),
      concat = require('gulp-concat'),
      cssnano = require('gulp-cssnano'),
      del = require('del'),
      eslint = require('gulp-eslint'),
      fs = require('fs'),
      gulpif = require('gulp-if'),
      //htmllint = require('gulp-htmllint'),
      //imagemin = require('gulp-imagemin'),
      include = require('gulp-html-tag-include'),
      prompt = require('gulp-prompt'),
      rename = require('gulp-rename'),
      replace = require('gulp-replace'),
      sass = require('gulp-sass')(require('sass')),
      scsslint = require('gulp-scss-lint'),
      uglify = require('gulp-uglify'),
      zip = require('gulp-zip'),
      config = require('./config.json');
      
const paths = {
  src: 'src/',
  srcSCSS: 'src/scss/**/*.scss',
  srcJS: 'src/js/**/*.js',
  srcImgs: 'src/imgs/**/*',
  srcMisc: 'src/misc/**/*',
  srcFonts: 'src/fonts/**/*',
  srcSource: 'src/**/*.html',
  dist: 'dist/',
  distCSS: 'dist/css/' + 'v' + config.version,
  distJS: 'dist/js/' + 'v' + config.version,
  distImgs: 'dist/imgs/' + 'v' + config.version,
  distFonts: 'dist/fonts/',
  handoff: 'handoff/'
}

function buildJS(){
  return src(paths.srcJS)
    .pipe(gulpif(config.concatJS, concat('script.js')))
    .pipe(uglify())
    .pipe(dest(paths.distJS));
}

function buildJSseries(cb) {
  series(lintJs, buildJS)(cb);
}

exports.buildJS = buildJSseries;


function buildSCSS(){
  return src(paths.srcSCSS)
  .pipe(sass().on('error', sass.logError))
  .pipe(replace('_IMGS', '/imgs/v' + config.version))
  .pipe(cssnano())
  .pipe(dest(paths.distCSS));
}

function buildImages(){
  return src(paths.srcImgs)
  //.pipe(gulpif(config.minifyImgs, imagemin()))
  .pipe(dest(paths.distImgs));
}

function buildMisc(){
  return src(paths.srcMisc, { dot: true })
  .pipe(dest(paths.dist))
}

function buildFonts(){
  return src(paths.srcFonts, { dot: true })
  .pipe(dest(paths.distFonts))
}

function zipTask(){
  del.sync(paths.handoff);
  return src(paths.dist + '**/*')
  .pipe(zip(config.name + '-' + config.version + '.zip'))
  .pipe(dest(paths.handoff))
}

function handleError(err) {
  console.log(err.toString());
}
/*
function lintHtml(){
  return src(paths.srcSource)
  .pipe(htmllint({failOnError: true}))
}
*/

function lintScss(){
  return src([paths.srcSCSS, '!src/scss/vendor/**/*'])
  .pipe(scsslint({'config': 'scss-lint.yml'}))
  .pipe(scsslint.failReporter())
  .on('error', handleError);
}

function lintJs(cb){
  return src([paths.srcJS, '!src/js/vendor/**/*'])
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError())
  .on('error', handleError);
}

function clean(cb){
  del.sync(paths.dist);
  return cb();
}

function reload(cb){
  browserSync.reload();
  return cb();
}

function buildSource(){
  return src([paths.srcSource, '!src/components/**/*.html'])
  .pipe(include())
  .pipe(replace('_CSS', '/css/v' + config.version))
  .pipe(replace('_JS', '/js/v' + config.version))
  .pipe(replace('_IMGS', '/imgs/v' + config.version))
  .pipe(dest(paths.dist))
}

function serve(cb){
  browserSync.init({
    server: {
      baseDir: paths.dist
    }
  }, function(){
    watch([paths.srcSource], series(buildSource, reload));
    watch([paths.srcJS], series(lintJs, buildJS, reload));
    watch([paths.srcSCSS], series(lintScss, buildSCSS, reload));
    //watch([paths.srcImgs], series(buildImages, reload));
    watch(paths.srcMisc, series(buildMisc, reload));
    watch(paths.srcFonts, series(buildFonts, reload));
  });
}

function setup(cb){
  return src('package.json')
  .pipe(prompt.prompt([{
    type: 'input',
    name: 'name',
    message: 'Enter website name'
  }], function(res){
    config.name = res.name;
    fs.writeFileSync('./config.json', JSON.stringify(config, null, '\t'));
    
    if (!fs.existsSync('src/components')){
      fs.mkdirSync('src/components');
    }
    if (!fs.existsSync('src/scss')){
      fs.mkdirSync('src/scss');
    }
    if (!fs.existsSync('src/js')){
      fs.mkdirSync('src/js');
    }
    if (!fs.existsSync('src/imgs')){
      fs.mkdirSync('src/imgs');
    }
    if (!fs.existsSync('src/misc')){
      fs.mkdirSync('src/misc');
    }
    if (!fs.existsSync('src/fonts')){
      fs.mkdirSync('src/fonts');
    }
  }));
}

exports.setup = setup;
exports.buildJS = buildJS;
exports.buildSCSS = buildSCSS;
exports.lintJs = lintJs;
exports.lintScss = lintScss;

exports.buildImages = buildImages;
exports.buildMisc = buildMisc;
exports.buildFonts = buildFonts;
exports.clean = clean;
exports.reload = reload;
exports.buildSource = buildSource;
exports.serve = serve;
exports.zipTask = zipTask;


exports.linters = parallel(exports.lintJs, exports.lintScss);
exports.buildJS = series(exports.lintJs, exports.buildJS);
exports.buildSCSS = series(exports.lintScss, exports.buildSCSS);
exports.build = series(exports.clean, parallel(exports.lintScss, exports.lintJs, exports.buildSource, exports.buildJS, exports.buildSCSS, exports.buildImages, exports.buildMisc, exports.buildFonts));
exports.serve = series(exports.build, exports.serve);
exports.package = series(exports.build, exports.zipTask);
