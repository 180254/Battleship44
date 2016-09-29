const gulp = require('gulp');
const closure = require("google-closure-compiler-js").gulp();
const sourcemaps = require('gulp-sourcemaps');
const fs = require('fs');

const path =
    (file) => "src/main/resources/static/js" + file;

const path_ = // src\main\...
    (file) => path(file).split("/").join("\\");

gulp.task("closure-convert", function () {
    return gulp
        .src([path("/app.es7-ts.js")])

        .pipe(sourcemaps.init({
            loadMaps: true,
        }))

        .pipe(closure({
            compilationLevel: "ADVANCED",
            warningLevel: "VERBOSE",
            languageIn: "ECMASCRIPT6_TYPED",
            languageOut: "ECMASCRIPT5_STRICT",
            outputWrapper: "(function(){\n%output%\n}).call(this)",
            jsOutputFile: "app.es5-closure.min.js",
            createSourceMap: true,
            externs: [
                {
                    src: fs.readFileSync(
                        "node_modules/google-closure-compiler-js/contrib/externs/jquery-1.12_and_2.2.js", "utf8"
                    )
                },
                {
                    src: "var DEBUG;" +
                    "function Cookies() {}; " +
                    "Cookies.get = function(name) {};" +
                    "Cookies.set = function(name, value) {};" +
                    "String.prototype.format = function(value) {};" +
                    "RegExp.prototype.escape = function(str) {};"
                },
            ]
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
