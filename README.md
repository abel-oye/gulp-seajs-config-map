## Note
在seajs配置文件后追加配置，让seajs知道静态资源编译后的路径。
```
seajs.config({map:[
    ['js/a.js', 'js/a-8cd72c35.js'],
    ['js/b.js', 'js/b-8cd72c35.js']
]});
```
追加配置后，重新对seajs配置文件签名哈希，并更新到manifest流中。

## Install
```
npm install --save-dev gulp-seajs-config-map
```

## Usage
```
var gulp = require('gulp');
var rev = require('gulp-rev'),
var seajsRev = require('gulp-seajs-config-map');

gulp.task('build', function() {
    return gulp.src('./testfiles/*.js', {base:'./testfiles'})
        .pipe(rev())
        .pipe(gulp.dest(./dist))
        .pipe(rev.manifest())
        .pipe(seajsRev({configFile:'dist/js/sea-config.js'}))
        .pipe(gulp.dest(./dist));
});
```

## Options
```
configFile: 需要追加seajs配置的文件相对路径，相对于manifest文件的路径。
```

## Licence
MIT
