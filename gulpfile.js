"use strict";

// Подключаем gulp и плагины
const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require("browser-sync");
const cached = require('gulp-cached');
const cleancss = require('gulp-clean-css');
const debug = require('gulp-debug');
const del = require('del');
const gulpIf = require('gulp-if');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const plumber = require('gulp-plumber');
const pug = require('gulp-pug');
const rigger = require('gulp-rigger');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const reload = browserSync.reload;

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == "development";

//Создаем перемнные где прописаны все пути
var path = {
	build: {					//Указываем куда складывать готовые после сборки файлы (build)
		html: 'build/',
		js: 'build/js/',
		css: 'build/css/',
		img: 'build/img/',
		font: 'build/font/'
	},
	production: {				//Указываем куда складывать готовые после сборки файлы (production)
		html: 'production/',
		js: 'production/js/',
		css: 'production/css/',
		img: 'production/img/',
		font: 'production/font/'
	},
	src: {						//Указываем пути откуда брать исходники
		html: 'src/index.pug',
		js: 'src/js/main.js',
		style: 'src/style/main.scss',
		img: 'src/img/**/*.*',
		font: 'src/font/**/*.*'
	},
	watch: {					//Указываем за изменением каких файлов наблюдать
		html: 'src/**/*.pug',
		js: 'src/js/**/*.js',
		style: 'src/style/**/*.scss',
		img: 'src/img/**/*.*',
		font: 'src/font/**/*.*'
	},
	clean: {				//Указываем пути очистки директорий build и production
		build: 'build/*',
		production: 'production/*'
	}
};

//Создаем переменную с настройками Dev сервера:
var config = {
	server: {
		baseDir: "./build"
	},
	//tunnel: false,
	host: 'localhost',
	port: 9000,
	logPrefix: "InvaderZ"
};

//Создаем задание собрать HTML
gulp.task('html:build', function () {
	return gulp.src(path.src.html)
		.pipe(plumber())
		.pipe(rigger())
		.pipe(pug({
			pretty: true
		}))		
		.pipe(gulpIf(isDevelopment, gulp.dest(path.build.html), gulp.dest(path.production.html)))
		.pipe(reload({stream: true}));
});

//Создаем задание собрать JavaScript
gulp.task('js:build', function () {
	return gulp.src(path.src.js)
		.pipe(plumber())
		.pipe(rigger())
		.pipe(gulpIf(isDevelopment, sourcemaps.init()))
		.pipe(gulpIf(!isDevelopment, uglify()))
		.pipe(gulpIf(isDevelopment, sourcemaps.write()))
		.pipe(gulpIf(isDevelopment, gulp.dest(path.build.js), gulp.dest(path.production.js)))
		.pipe(reload({stream: true}));
});

//Создаем задание собрать SCSS
gulp.task('style:build', function () {
	return gulp.src(path.src.style)
		.pipe(plumber())
		.pipe(gulpIf(isDevelopment, sourcemaps.init()))
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(gulpIf(!isDevelopment, cleancss()))
		.pipe(gulpIf(isDevelopment, sourcemaps.write()))
		.pipe(gulpIf(isDevelopment, gulp.dest(path.build.css), gulp.dest(path.production.css)))
		.pipe(reload({stream: true}));
})

//Создаем задание собрать картинки
gulp.task('img:build', function () {
	return gulp.src(path.src.img, {since: gulp.lastRun('img:build')})
		.pipe(plumber())
		.pipe(gulpIf(isDevelopment, newer(path.build.img), newer(path.production.img)))
		.pipe(debug({title: 'Images build:'}))
		.pipe(gulpIf(!isDevelopment, imagemin ()))
		.pipe(gulpIf(isDevelopment, gulp.dest(path.build.img), gulp.dest(path.production.img)))
		.pipe(reload({stream: true}));
});

//Создаем задание собрать шрифты
gulp.task('font:build', function() {
	return gulp.src(path.src.font, {since: gulp.lastRun('font:build')})
		.pipe(plumber())
		.pipe(gulpIf(isDevelopment, newer(path.build.font), newer(path.production.font)))
		.pipe(debug({title: 'Font build:'}))
		.pipe(gulpIf(isDevelopment, gulp.dest(path.build.font), gulp.dest(path.production.font)))
		.pipe(reload({stream: true}));
});

//Создаем задание для всей сборки
gulp.task('build', gulp.parallel('html:build', 'js:build', 'style:build', 'img:build', 'font:build'));


// //Создаем задание для автоматической сборки при изменении файла
// gulp.task('watch', function(){
// 	gulp.watch([path.watch.html], function(event, cb) {
// 		gulp.start('html:build');
// 	});
// 	gulp.watch([path.watch.style], function(event, cb) {
// 		gulp.start('style:build');
// 	});
// 	gulp.watch([path.watch.js], function(event, cb) {
// 		gulp.start('js:build');
// 	});
// 	gulp.watch([path.watch.img], function(event, cb) {
// 		gulp.start('image:build');
// 	});
// 	gulp.watch([path.watch.font], function(event, cb) {
// 		gulp.start('font:build');
// 	});
// });

// //Создаем задание для запуска Dev сервера
// gulp.task('webserver', function () {
// 	browserSync(config);
// });

//Создаем задание для очистки папки build
gulp.task('build:clean', function () {
	return del(path.clean.build);
});

//Создаем задание для очистки папки production
gulp.task('production:clean', function () {
	return del(path.clean.production);
});

//Создаем задание для очистки папок build и production
gulp.task('clean', gulp.parallel('build:clean', 'production:clean'));

gulp.task('watch', function(){
	gulp.watch([path.watch.html], gulp.series('html:build'));
	gulp.watch([path.watch.style], gulp.series('style:build'));
	gulp.watch([path.watch.js], gulp.series('js:build'));
	gulp.watch([path.watch.img], gulp.series('img:build'));
	gulp.watch([path.watch.font], gulp.series('font:build'));
});

// //Создаем задание для запуска всей сборки, Dev сервера и gulp-watch
// gulp.task('default', ['build', 'webserver', 'watch']);
gulp.task('default', gulp.series('build', 'watch'));