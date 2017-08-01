/**
 * Created by ������ on 2017/8/1.
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
        root: './themes/SIX/source',      //���кܶ����ò������������API https://www.npmjs.com/package/gulp-connect
        livereload: true
    })
});
//�����������е���
gulp.task('reload',function(){
    gulp.src(['./themes/SIX/source/*.html','./themes/SIX/source/js/*.js','./themes/SIX/source/css/*.css'])
        .pipe(plugins.connect.reload());   //�ڴ˴�����connectˢ��ҳ��
});

gulp.task('watch',function(){
    gulp.watch('./sass/**/*.scss',['sass']);
    gulp.watch(['./themes/SIX/source/*.html','./themes/SIX/source/js/*.js'],['reload']);
});

gulp.task('default',['connect','watch'])