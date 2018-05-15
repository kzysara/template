var gulp = require('gulp');
var scss = require('gulp-sass');

//** Browser-Sync **//
var browserSync = require('browser-sync').create();
var browserSyncReload = browserSync.reload;

var sourcemaps  = require('gulp-sourcemaps');

//** Post CSS Modules **//
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');

// optimize
var stripCssComments = require('gulp-strip-css-comments');
var cleanCSS = require('gulp-clean-css');

var replace = require('gulp-url-replace')
var urlAdjuster = require('gulp-css-replace-url');


// ---------------------------------------------------------------------
// | SCSS : SCSS Config(환경설정) |
// ---------------------------------------------------------------------
var scssOptions = {
    /** * outputStyle (Type : String , Default : nested) * CSS의 컴파일 결과 코드스타일 지정 * Values : nested, expanded, compact, compressed */
    outputStyle : "compact",
    /** * indentType (>= v3.0.0 , Type : String , Default : space) * 컴파일 된 CSS의 "들여쓰기" 의 타입 * Values : space , tab */
    indentType : "tab",
    /** * indentWidth (>= v3.0.0, Type : Integer , Default : 2) * 컴파일 된 CSS의 "들여쓰기" 의 갯수 */
    indentWidth : 1, // outputStyle 이 nested, expanded 인 경우에 사용
    /** * precision (Type : Integer , Default : 5) * 컴파일 된 CSS 의 소수점 자리수. */
    precision: 6,
    /** * sourceComments (Type : Boolean , Default : false) * 컴파일 된 CSS 에 원본소스의 위치와 줄수 주석표시. */
    sourceComments: false
};

// ---------------------------------------------------------------------
// | postcss : processors |
// ---------------------------------------------------------------------
var processors = [
    autoprefixer({
        browsers: ['last 2 version', 'ie 8', 'ie 9']
    })
];

// ---------------------------------------------------------------------
// | SCSS Compile |
// ---------------------------------------------------------------------

function scss_compile(target_url){
    return function () {
        // SCSS 파일을 읽어온다.
        gulp.src([
            target_url + 'scss/*.scss',
            target_url + 'scss/**/*.scss',
            target_url + 'scss/**/**/*.scss',
        ])
        // 소스맵 초기화(소스맵을 생성)
            .pipe(sourcemaps.init())
            // SCSS 함수에 옵션갑을 설정, SCSS 작성시 watch 가 멈추지 않도록 logError 를 설정
            .pipe(scss(scssOptions).on('error', scss.logError))
            // 위에서 생성한 소스맵을 사용한다.
            .pipe(sourcemaps.write('.'))
            // 목적지(destination)을 설정
            .pipe(gulp.dest(target_url + 'css'))
            .pipe(browserSync.stream());
    }
}

function css_optimize(source_url, target_url){
    return function () {
        var cashTime='';
        var dateObj = new Date();
        cashTime += dateObj.getSeconds();
        cashTime += dateObj.getMilliseconds();

        gulp.src(source_url + 'css/*.css')
            .pipe(stripCssComments()) //delete css's comments
            .pipe(postcss(processors)) // autoprefix
            //.pipe(cleanCSS({ compatibility: 'ie8' }))  // compressed, clean css comment
            // .pipe(urlAdjuster({
            //     //prepend: '/image_directory/', //프리픽스 경로 추가
            //    // prependRelative: '/image_directory/', // 절대 경로로 교체
            //    // replace:  ['../img/','/brand/new/'], //이미지 경로 교체
            //     append: '?version='+ cashTime,
            // }))
            .pipe(gulp.dest(target_url + 'css')); // pipe to css folder
    }
}

// ---------------------------------------------------------------------
// | assets copy  | css url replace
// ---------------------------------------------------------------------

function copy_assets(source_url, target_url){
    return function () {
        gulp.src(source_url + 'images/*')
            .pipe(gulp.dest(target_url+'images/'));
        gulp.src(source_url + 'js/*')
            .pipe(gulp.dest(target_url+'js/'));
    }
}

function url_replace_in_html(source_url, target_url){
    return function () {
        gulp.src(source_url + '*.html')
            .pipe(replace({
                '../image/': '/root/sample_url/',
                '/src/': '/dist/',
                //'js/': '/ab/js/',
            }))
            .pipe(gulp.dest(target_url+'/'))
    }
}


// ---------------------------------------------------------------------
// | 경로 정의
// ---------------------------------------------------------------------

// 작업할 폴더 Setting
var  WORK_ROOT_PATH = '.';

var PATH_ARR = [
    WORK_ROOT_PATH + '/',
];

var ARR_TASK_COMPILE = [];
var ARR_TASK_OPTIMIZE = [];

// define task : SCSS -> CSS & Build
for(var i=0; i<PATH_ARR.length; i++){
    var BUILD_PATH=PATH_ARR[i] + 'dist/';
    // scss comfile task
    ARR_TASK_COMPILE[i] = 'scss:compile_' + i;
    gulp.task(ARR_TASK_COMPILE[i], scss_compile(PATH_ARR[i]+'src/assets/'));

    // build:  Asset Copy / Html url replace
    // autoprefix and combine media queries task
    ARR_TASK_OPTIMIZE.push('css:optimize_' + i);
    ARR_TASK_OPTIMIZE.push('html:optimize_' + i) ;
    ARR_TASK_OPTIMIZE.push('copy:assets_' + i) ;

    gulp.task('css:optimize_' +[i], css_optimize(PATH_ARR[i]+'src/assets/', BUILD_PATH + 'assets/'));
    gulp.task('html:optimize_'+[i], url_replace_in_html(PATH_ARR[i], BUILD_PATH));
    gulp.task('copy:assets_'+[i], copy_assets(PATH_ARR[i]+'src/assets/', BUILD_PATH + 'assets/'));
}



// ---------------------------------------------------------------------
// | Main tasks
// ---------------------------------------------------------------------


// define task : watch
gulp.task('watch',
    // first, compile
    ARR_TASK_COMPILE,

    // start watch
    function(){
        for(var i=0; i<PATH_ARR.length; i++){
            // 경로는 각각 폴더의 가장 깊은 뎁스 기준으로 정의한다.
            gulp.watch(PATH_ARR[i] +'scss/**/**/**/*.scss', [ARR_TASK_COMPILE[i]]);
            gulp.watch(PATH_ARR[i] +'*.html').on('change', browserSync.reload);
        }
    }
);

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir:WORK_ROOT_PATH
        },
        startPath: 'index.html'
    });
});

// define task : build for product (optimaize)
gulp.task('build', ARR_TASK_OPTIMIZE);

// define task : start work ( watch)
gulp.task('default', ['watch','browser-sync']);