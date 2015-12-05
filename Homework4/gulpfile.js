var gulp = require('gulp');
gulp.task('test_task', function() {
    console.log('my task');
});

var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('concat', function() {
    gulp.src('task*')
        .pipe(concat('result.txt'))
        .pipe(gulp.dest('./build/'));
});

gulp.task('rownosc', function() {
    var m = 10;
    var n = 10;
    if(m == n) {
        console.log('Liczby sa rowne');
    }
});

gulp.task('nierownosc', function() {
    var m = 10;
    var n = 20;
    if(m != n) {
        console.log('Liczby nie sa rowne');
    }
});