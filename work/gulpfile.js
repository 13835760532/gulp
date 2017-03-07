/* = Gulp���
 -------------------------------------------------------------- */
// ����gulp
var gulp			= require('gulp');					// ������

// �������ǵ�gulp���
var sass 			= require('gulp-ruby-sass'),			// CSSԤ����/Sass����
    uglify 			= require('gulp-uglify'),				// JS�ļ�ѹ��
    imagemin 		= require('gulp-imagemin'),		// imagemin ͼƬѹ��
    pngquant 		= require('imagemin-pngquant'),	// imagemin ���ѹ��
    livereload 		= require('gulp-livereload'),			// ��ҳ�Զ�ˢ�£����������ƿͻ���ͬ��ˢ�£�
    webserver 		= require('gulp-webserver'),		// ���ط�����
    rename 		= require('gulp-rename'),			// �ļ�������
    sourcemaps 	= require('gulp-sourcemaps'),		// ��Դ��ͼ
    changed 		= require('gulp-changed'),			// ֻ�����й��޸ĵ��ļ�
    concat 			= require("gulp-concat"), 			// �ļ��ϲ�
    clean 			= require('gulp-clean');				// �ļ�����
    less            = require('gulp-less');                 //lessԤ����
    minifyCss       = require('gulp-minify-css'); // CSSѹ��
/* = ȫ������
 -------------------------------------------------------------- */
var srcPath = {
    html	: 'src',
    css		: 'src/sass',
    script	: 'src/js',
    image	: 'src/images',
    less    : 'src/less'
};
var destPath = {
    html	: 'dist',
    css		: 'dist/sass',
    script	: 'dist/js',
    image	: 'dist/images',
    less    : 'dist/less',
    lessmin : 'dist/less-min',
    sassmin : 'dist/sass-min'
};

/* = ��������( Ddevelop Task )
 -------------------------------------------------------------- */
// HTML����
gulp.task('html', function() {
    return gulp.src( srcPath.html+'/**/*.html' )
        .pipe(changed( destPath.html ))
        .pipe(gulp.dest( destPath.html ));
});
// ��ʽ����
gulp.task('sass', function () {
    return sass( srcPath.css, { style: 'compact', sourcemap: true }) // ָ��Դ�ļ�·�����������ļ�ƥ�䣨�����񣺼���ʽ��
        .on('error', function (err) {
            console.error('Error!', err.message); // ��ʾ������Ϣ
        })
        .pipe(sourcemaps.write('maps')) // ��ͼ���·�������λ�ã�
        .pipe(gulp.dest( destPath.css )); // ���·��
});
//less����
gulp.task('less',function(){
    return gulp.src(srcPath.less+'/*.less')
        .pipe(less())
        .pipe(gulp.dest(destPath.less))
})
//ѹ��css
gulp.task('minify-less-css', function() {
    //return gulp.src(destPath.css+'/*.css')
    //    .pipe(gulp.dest(destPath.min));
    return gulp.src(destPath.less+'/*.css')
        .pipe(gulp.dest(destPath.lessmin));
});
gulp.task('minify-sass-css', function() {
    return gulp.src(destPath.css+'/*.css')
        .pipe(gulp.dest(destPath.sassmin));
});
// JS�ļ�ѹ��&������
gulp.task('script', function() {
    return gulp.src( [srcPath.script+'/*.js','!'+srcPath.script+'/*.min.js'] ) // ָ��Դ�ļ�·�����������ļ�ƥ�䣬�ų� .min.js ��׺���ļ�
        .pipe(changed( destPath.script )) // ��Ӧƥ����ļ�
        .pipe(sourcemaps.init()) // ִ��sourcemaps
        .pipe(rename({ suffix: '.min' })) // ������
        .pipe(uglify({ preserveComments:'some' })) // ʹ��uglify����ѹ��������������ע��
        .pipe(sourcemaps.write('maps')) // ��ͼ���·�������λ�ã�
        .pipe(gulp.dest( destPath.script )); // ���·��
});
// imagemin ͼƬѹ��
gulp.task('images', function(){
    return gulp.src( srcPath.image+'/**/*' ) // ָ��Դ�ļ�·��������ƥ��ָ����ʽ���ļ�������д�� .{png,jpg,gif,svg}
        .pipe(changed( destPath.image ))
        .pipe(imagemin({
            progressive: true, // ����ѹ��JPGͼƬ
            svgoPlugins: [{removeViewBox: false}], // ��Ҫ�Ƴ�svg��viewbox����
            use: [pngquant()] // ���ѹ��PNG
        }))
        .pipe(gulp.dest( destPath.image )); // ���·��
});
// �ļ��ϲ�
gulp.task('concat', function () {
    return gulp.src( srcPath.script+'/*.min.js' )  // Ҫ�ϲ����ļ�
        .pipe(concat('libs.js')) // �ϲ���libs.js
        .pipe(rename({ suffix: '.min' })) // ������
        .pipe(gulp.dest( destPath.script )); // ���·��
});
// ���ط�����
gulp.task('webserver', function() {
    gulp.src( destPath.html ) // ������Ŀ¼��.�����Ŀ¼��
        .pipe(webserver({ // ����gulp-webserver
            livereload: true, // ����LiveReload
            open: true // ����������ʱ�Զ�����ҳ
        }));
});
// ��������
gulp.task('watch',function(){
    // ���� html
    gulp.watch( srcPath.html+'/**/*.html' , ['html'])
    // ���� scss
    gulp.watch( srcPath.css+'/*.scss' , ['sass']);
    // ���� images
    gulp.watch( srcPath.image+'/**/*' , ['images']);
    // ���� js
    gulp.watch( [srcPath.script+'/*.js','!'+srcPath.script+'/*.min.js'] , ['script']);
});
// Ĭ������
gulp.task('default',['webserver','watch']);

/* = ��������( Release Task )
 -------------------------------------------------------------- */
// �����ļ�
gulp.task('clean', function() {
    return gulp.src( [destPath.css+'/maps',destPath.script+'/maps'], {read: false} ) // ����maps�ļ�
        .pipe(clean());
});
// ��ʽ����
gulp.task('sassRelease', function () {
    return sass( srcPath.css, { style: 'compressed' }) // ָ��Դ�ļ�·�����������ļ�ƥ�䣨������ѹ����
        .on('error', function (err) {
            console.error('Error!', err.message); // ��ʾ������Ϣ
        })
        .pipe(gulp.dest( destPath.css )); // ���·��
});
// �ű�ѹ��&������
gulp.task('scriptRelease', function() {
    return gulp.src( [srcPath.script+'/*.js','!'+srcPath.script+'/*.min.js'] ) // ָ��Դ�ļ�·�����������ļ�ƥ�䣬�ų� .min.js ��׺���ļ�
        .pipe(rename({ suffix: '.min' })) // ������
        .pipe(uglify({ preserveComments:'some' })) // ʹ��uglify����ѹ��������������ע��
        .pipe(gulp.dest( destPath.script )); // ���·��
});
// �������
gulp.task('release', ['clean'], function(){ // ��ʼ����ǰ����ִ��[clean]����
    return gulp.start('sassRelease','scriptRelease','images'); // ��[clean]����ִ����Ϻ���ִ����������
});

/* = ������ʾ( Help )
 -------------------------------------------------------------- */
gulp.task('help',function () {
    console.log('----------------- �������� -----------------');
    console.log('gulp default		����������Ĭ������');
    console.log('gulp html		HTML����');
    console.log('gulp sass		��ʽ����');
    console.log('gulp script		JS�ļ�ѹ��&������');
    console.log('gulp images		ͼƬѹ��');
    console.log('gulp concat		�ļ��ϲ�');
    console.log('---------------- �������� -----------------');
    console.log('gulp release		�������');
    console.log('gulp clean		�����ļ�');
    console.log('gulp sassRelease		��ʽ����');
    console.log('gulp scriptRelease	�ű�ѹ��&������');
    console.log('---------------------------------------------');
});