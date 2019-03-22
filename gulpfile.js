'use strict';

var gulp           	   = require('gulp'),
		jade 		   = require('gulp-jade'),
		gutil          = require('gulp-util' ),
		sass           = require('gulp-sass'),
		browserSync    = require('browser-sync'),
		concat         = require('gulp-concat'),
		uglify         = require('gulp-uglify'),
		cleanCSS       = require('gulp-clean-css'),
		rename         = require('gulp-rename'),
		del            = require('del'),
		imagemin       = require('gulp-imagemin'),
		cache          = require('gulp-cache'),
		autoprefixer   = require('gulp-autoprefixer'),
		ftp            = require('vinyl-ftp'),
		notify         = require("gulp-notify");

// Скрипты

gulp.task('jade', function() {
	return gulp.src('app/jade/*.jade')
		.pipe(jade({
			pretty:true
		}))
		.pipe(gulp.dest('app'))
		.pipe(browserSync.reload({stream: true})); // указываем gulp куда положить скомпилированные HTML файлы
});

gulp.task('libs', function() {
	return gulp.src([
		'app/libs/**/*.*'
	])
		.pipe(gulp.dest('dest/libs'));
});

gulp.task('common-js', function() {
	return gulp.src([
		'app/js/common.js'
	])
		.pipe(gulp.dest('app/js'));
});

gulp.task('common-js', function() {
	return gulp.src([
		'app/js/common.js'
		])
	.pipe(concat('common.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('dest/js'));
});


gulp.task('js', ['common-js'], function() {
	return gulp.src([
		'app/libs/jquery/dest/jquery.min.js',
		'app/js/common.js' // Всегда в конце
		])
	.pipe(concat('common.js'))
	//.pipe(uglify()) // Минимизировать весь js (на выбор)
	.pipe(gulp.dest('dest/js'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false
		// tunnel: true,
		// tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
	});
});

gulp.task('sass', function() {
	return gulp.src('app/sass/**/*.sass')
	.pipe(sass({outputStyle: 'expand'}).on("error", notify.onError()))
	//.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(autoprefixer(['last 15 versions']))
	//.pipe(cleanCSS()) // Опционально, закомментировать при отладке
	.pipe(gulp.dest('app/css'))
	.pipe(gulp.dest('dest/css'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', ['sass', 'js', 'browser-sync'], function() {
	gulp.watch('app/sass/**/*.sass', ['sass']);
	gulp.watch('app/jade/**/*.jade', ['jade']);
	gulp.watch('app/sass/**/*.sass', ['sass']);
	gulp.watch(['libs/**/*.js', 'app/js/common.js'], ['js']);
	gulp.watch('app/*.html', browserSync.reload);
});

gulp.task('imagemin', function() {
	return gulp.src('app/img/**/*')
	.pipe(cache(imagemin()))
	.pipe(gulp.dest('dest/img'));
});

gulp.task('build', ['removedist', 'imagemin', 'libs', 'sass', 'js'], function() {

	var buildFiles = gulp.src([
		'app/*.html',
		'app/.htaccess'
		]).pipe(gulp.dest('dest'));

	var buildCss = gulp.src([
		'app/css/main.css'
		])
		.pipe(rename({suffix: '.min', prefix : ''}))
		.pipe(cleanCSS())
		.pipe(gulp.dest('dest/css'));

	var buildJs = gulp.src([
		'app/js/scripts.min.js'
		]).pipe(gulp.dest('popup/js'));

	var buildFonts = gulp.src([
		'app/fonts/**/*'
		]).pipe(gulp.dest('dest/fonts'));

});

gulp.task('deploy', function() {

	var conn = ftp.create({
		host:      'hostname.com',
		user:      'username',
		password:  'userpassword',
		parallel:  10,
		log: gutil.log
	});

	var globs = [
	'dest/**',
	'dest/.htaccess',
	];
	return gulp.src(globs, {buffer: false})
	.pipe(conn.dest('/path/to/folder/on/server'));

});

gulp.task('removedist', function() { return del.sync('popup'); });
gulp.task('clearcache', function () { return cache.clearAll(); });

gulp.task('default', ['watch']);
