// es5

/*                default settings
 +-------------------------+-------------+--------------+
 |  sth about js / debug?  |    true     |    false     |
 +-------------------------+-------------+--------------+
 | version                 | ES7         | ES5+polyfill |
 +-------------------------+-------------+--------------+
 | minified                | no          | yes          |
 +-------------------------+-------------+--------------+
 | load source map         | yes         | no           |
 +-------------------------+-------------+--------------+
 | console debug msg       | all         | warns        |
 +-------------------------+-------------+--------------+
 */

var DEBUG = false;
var API_WS_URL = window.location.host;

// app loader
// - easily change app version (?v=5c)
// - easily change load mode (?m=ss)
// - easily change debug flag (?d=1)
// - load additional libs for specified ver
$(function () {

    var modes = {
        "ss": "script-src",
        "st": "script-text"
    };

    var scripts = {
        "7t": [
            "js/app.es7-ts.js"
        ],
        "7b": [
            "js/app.es7-babel.min.js"
        ],
        "5b": [
            "js/lib/babel-polyfill/polyfill.min.js",
            "js/app.es5-babel.min.js"
        ],
        "5c": [
            "js/lib/babel-polyfill/polyfill.min.js",
            "js/app.es5-closure.min.js"
        ],
    };

    var defaults = {
        debug: {
            mode: "ss",
            script: "7t"
        },
        prod: {
            mode: "st",
            script: "5b"
        }
    };

    // ---------------------------------------------------------------------------------------------------------------

    var loadScript = function (mode, src) {

        if (mode === "script-src") {
            // create tag <script src="xx"></script>
            // - browser loads source map
            // - useful for debugging
            var scripts = document.getElementById("script");
            var ref = document.createElement("script");

            ref.setAttribute("src", src);
            scripts.appendChild(ref);

            // jQuery alert!
            // $("<script>", {src: src}).appendTo("#script"); code is misleading
            // it loads file using xhr, and then execute jQuery.DOMEval method
            // discussed at stackoverflow: http://stackoverflow.com/q/15459218

            return new $.Deferred().resolve();

        } else if (mode === "script-text") {
            // create tag <script>code</script>
            // - browser does _not_ load source map
            // - sourceMappingURL comment need not be removed
            // - useful for production

            return $.ajax({dataType: "script", cache: true, url: src});
        }
    };

    // ---------------------------------------------------------------------------------------------------------------

    var urlParam = function (name) {
        var nameEsc = name.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        var results = new RegExp('[\?&]' + nameEsc + '=([^&#]*)').exec(window.location.href);
        return results ? decodeURIComponent(results[1]) : null;
    };

    // ---------------------------------------------------------------------------------------------------------------

    // returns:
    // * value if validArray.contains(value)
    // * default value if not
    var requireValid = function (value, validArray, defaultVal) {
        return value && validArray.indexOf(value) !== -1
            ? value
            : defaultVal;
    };

    // ---------------------------------------------------------------------------------------------------------------

    var debug = requireValid(
        urlParam("d"),
        ["1", "0"],
        DEBUG
    );

    DEBUG = !!+debug; // convert to boolean; may be "0", "1", 0, 1, false, true

    // ---------------------------------------------------------------------------------------------------------------

    var mode = requireValid(
        urlParam("m"),
        Object.keys(modes),
        DEBUG ? defaults.debug.mode : defaults.prod.mode
    );

    var script = requireValid(
        urlParam("v"),
        Object.keys(scripts),
        DEBUG ? defaults.debug.script : defaults.prod.script
    );


    var mode_ = modes[mode];
    var script_ = scripts[script];

    // ---------------------------------------------------------------------------------------------------------------

    var deferred = new $.Deferred();
    var pipe = deferred;

    $.each(script_, function (i, val) {
        pipe = pipe.pipe(function () {
            return loadScript(mode_, val)
                .then(function () {
                    if (DEBUG) {
                        console.log("debug | app.loader | ok=" + val)
                    }
                }, function () {
                    console.log("ERROR | app.loader | fail=" + val)
                });
        });
    });

    deferred.resolve();
});
