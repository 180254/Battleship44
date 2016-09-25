const gulp = require('gulp');
const closure = require("google-closure-compiler-js").gulp();
const sourcemaps = require('gulp-sourcemaps');

const path =
    (file) => "src/main/resources/static/js" + file;

const path_ = // src\main\...
    (file) => path(file).split("/").join("\\");

gulp.task("closure-convert", function () {
    return gulp.src([path("/app.es7-ts.js")])
        .pipe(sourcemaps.init({
            loadMaps: true,
        }))
        .pipe(closure({
            compilationLevel: "ADVANCED",
            warningLevel: "DEFAULT",
            languageIn: "ES6_STRICT",
            languageOut: "ES5_STRICT",
            outputWrapper: "(function(){\n%output%\n}).call(this)",
            jsOutputFile: "app.es5-closure.min.js",
            createSourceMap: true,
        }))

        .pipe(sourcemaps.write(".", {
            includeContent: false,
            sourceRoot: "",
            mapSources: sp => sp
                .replace(path("/"), "")
                .replace(path_("/"), ""),
        }))
        .pipe(gulp.dest(path("/")));
});
