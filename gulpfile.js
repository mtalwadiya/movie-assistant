
(function () {
  'use strict';

  var args = require('yargs')
    .default('target', 'production')
    .default('open', true)
    .argv;
  var gulp = require('gulp');
  var $ = require('gulp-load-plugins')();
  var del = require('del');
  var runSequence = require('run-sequence');
  var browserSync = require('browser-sync');
  var reload = browserSync.reload;
  var srcFolder = 'app';
  var distFolder = 'public';

  var isProduction = (args.target === 'production' || args.target === undefined);

  $.util.log('Using configuration', $.util.colors.cyan(args.target));

  gulp.on('error', $.util.log);

  gulp.task('bower', function () {
    return $.bower('.tmp/bower_components');
  });

  gulp.task('lint', [ 'js:lint', 'styles:lint' ]);

  gulp.task('autolint', ['lint'], function () {
    gulp.watch([ srcFolder + '/**/*.js', srcFolder + '/**/*.{css,scss}' ], ['lint']);
  });

  gulp.task('js:lint', function () {
    return gulp.src([ '!' + srcFolder + '/vendor/**/*.js', '!' + srcFolder + '/bower_components/**/*.*', srcFolder + '/**/*.js',  srcFolder + '/*.js'])
      .pipe($.eslint())
      .pipe($.eslint.formatEach())
      .pipe($.if(!browserSync.active, $.eslint.failOnError()))
      .pipe(reload({ 'stream': true }));
  });

  gulp.task('js:compile', function () {
    return gulp.src([srcFolder + '/**/*.js'])
      .pipe($.preprocess())
      .pipe(gulp.dest('.tmp'));
  });

  gulp.task('fonts', ['bower'], function () {
    return gulp.src(srcFolder+ '/fonts/**/*')
      .pipe(gulp.dest(distFolder + '/fonts'))
      .pipe(reload({ 'stream': true, 'once': true }))
      .pipe($.size({ 'title': 'fonts' }));
  });

  gulp.task('images', function () {
    return gulp.src(srcFolder + '/images/**/*')
      .pipe(gulp.dest(distFolder + '/images'))
      .pipe(reload({ 'stream': true, 'once': true }))
      .pipe($.size({ 'title': 'images' }));
  });

  gulp.task('styles:css', function () {
    return gulp.src(srcFolder + '/**/*.css')
      .pipe($.autoprefixer('last 1 version'))
      .pipe(gulp.dest('.tmp'))
      .pipe(reload({ 'stream': true }))
      .pipe($.size({ 'title': 'styles:css' }));
  });

  gulp.task('styles:lint', function () {
     gulp.src(srcFolder + '/**/*.css')
      .pipe($.scssLint());
  });

  //gulp.task('styles', [ 'styles:scss', 'styles:css' ]);
  gulp.task('styles', [ 'styles:css' ]);
  
  gulp.task('html:compile', function () {
    return gulp.src([ '!' + srcFolder + '/index.html', '!' + srcFolder + '/legal/WhatsInTheaters_TermsOfUse.html', srcFolder + '/**/*.html' ])
      .pipe($.if(isProduction, $.minifyHtml({ 'empty': true })))
      .pipe($.angularTemplatecache('templates.js', { 'standalone': true }))
      .pipe(gulp.dest('.tmp'));
  });
  
  gulp.task('html:copy', function () {
      return gulp.src([ srcFolder + '/legal/WhatsInTheaters_TermsOfUse.html'])
        .pipe($.minifyHtml({ 'empty': true }))
        .pipe(gulp.dest(distFolder + '/legal'));
    });

  gulp.task('html', [ 'bower', 'js:compile', 'html:compile', 'html:copy' ], function () {
    var assets = $.useref.assets({ 'searchPath': '.tmp' });

    return gulp.src(srcFolder + '/index.html')
      .pipe(assets)
      .pipe($.if('*\\.js', $.ngAnnotate()))
      .pipe($.if('*\\.js', $.if(isProduction, $.uglify())))
      .pipe($.if('*\\.css', $.if(isProduction, $.minifyCss())))
      .pipe(assets.restore())
      .pipe($.useref())
      .pipe($.if('*\\.html', $.if(isProduction, $.minifyHtml({ 'empty': true, 'quotes': true }))))
      .pipe(gulp.dest(distFolder))
      .pipe($.size({ 'title': 'html' }));
  });

  gulp.task('docs', function () {
    var infos = {
      'plugins': ['plugins/markdown']
    };
    gulp.src([ srcFolder + '/**/*.js', 'README.md' ])
      .pipe($.jsdoc.parser(infos))
      .pipe($.jsdoc.generator('.tmp/jsdoc'));
  });

  gulp.task('serve', [ 'bower', 'styles', 'fonts', 'js:compile', 'html:compile' ], function () {
    browserSync({
      'notify': false,
      'open': args.open,
      'server': {
        'baseDir': [ '.tmp', 'app', '.tmp_examples' ]
      },
      'ports': {
       'min': 9090,
       'max': 9090
      }
    });

    gulp.watch([srcFolder + '/**/*.html'], [ 'html:compile', reload ]);
    gulp.watch([srcFolder + '/**/*.{css,scss}'], ['styles']);
    gulp.watch(['.tmp/styles/**/*.css'], reload);
    gulp.watch([srcFolder + '/**/*.js'], [ 'js:compile', reload ]);
//    gulp.watch(['app/fonts/**/*'], ['fonts']);
  });

  gulp.task('clean', del.bind(null, [ '.tmp', 'test_out', distFolder ]));

  gulp.task('dist', ['clean'], function (cb) {
    runSequence('styles', [ 'html', 'fonts', 'images' ], cb);
  });


  gulp.task('default', [], function (cb) {
    runSequence('dist', cb);
  });

}());
