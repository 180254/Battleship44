const gulp = require("gulp");
const closure = require("google-closure-compiler-js").gulp();
const sourcemaps = require("gulp-sourcemaps");
const replace = require("gulp-replace");
const fs = require("fs");

const path =
    (file) => "src/main/resources/static/js" + file;

const path_ = // src\main\...
    (file) => path(file).split("/").join("\\");

gulp.task("closure-convert", function () {
    return gulp
        .src([path("/app.es7-ts.js")])

        // "Non const enums breaking Closure Compiler Advanced" ts issue fix
        // https://github.com/Microsoft/TypeScript/issues/2655#issuecomment-146268149
        .pipe(replace(/(\w+)\[(\1)\["([^"]*)"] = (\d+)] = "(\3)";/g, "$1[$1.$3 = $4] = \"$3\";"))

        .pipe(sourcemaps.init({
            loadMaps: true,
        }))

        .pipe(closure({
            compilationLevel: "ADVANCED",
            warningLevel: "VERBOSE",
            languageIn: "ECMASCRIPT6_TYPED",
            languageOut: "ECMASCRIPT5_STRICT",
            // outputWrapper: "(function(){\n%output%\n}).call(this)",
            outputWrapper: "%output%",
            jsOutputFile: "app.es5-closure.min.js",
            createSourceMap: true,
            rewritePolyfills: false,

            externs: [
                {
                    src: fs.readFileSync(
                        "node_modules/google-closure-compiler-js/contrib/externs/jquery-1.12_and_2.2.js", "utf8"
                    )
                },
                {
                    src: `var DEBUG;
                    function Cookies() {}; 
                    Cookies.get = function(name) {};
                    Cookies.set = function(name, value) {}
                    /**
                     * @param {...*} varArgs
                     */
                    String.prototype.format = function(varArgs) {};
                    RegExp.prototype.escape = function(str) {};
                    window.navigator.language = "";
                    window.navigator.languages = [""];
                    window.navigator.userLanguage = "";
                    window.navigator.browserLanguage = "";
                    window.navigator.systemLanguage = "";`
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