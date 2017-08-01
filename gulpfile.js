/**
 * Created by 胡东斌 on 2017/8/1.
 */

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

gulp.task('sass', function() {
    gulp.src('sass/*.scss')
        .pipe(plugins.sass({
            outputStyle: 'compressed'
        }).on('error', plugins.sass.logError))
        .pipe(gulp.dest('themes/SIX/source/css'));
});

gulp.task('connect', function() {
    plugins.connect.server({
        root: './themes/SIX/source',      //还有很多配置参数，详情请见API https://www.npmjs.com/package/gulp-connect
        livereload: true
    })
});
//在其他任务中调用
gulp.task('reload',function(){
    gulp.src(['./themes/SIX/source/*.html','./themes/SIX/source/js/*.js','./themes/SIX/source/css/*.css'])
        .pipe(plugins.connect.reload());   //在此处调用connect刷新页面
});

gulp.task('watch',function(){
    gulp.watch('./sass/**/*.scss',['sass']);
    gulp.watch(['./themes/SIX/source/*.html','./themes/SIX/source/js/*.js'],['reload']);
});

gulp.task('default',['connect','watch'])