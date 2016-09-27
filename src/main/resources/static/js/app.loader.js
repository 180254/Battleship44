// change app version. example: ?v=5c&m=st
$(function () {

    //         default settings
    // +-----------------+------+-------+
    // |   sth / debug?  | true | false |
    // +-----------------+------+-------+
    // | js version      | ES7  | ES5   |
    // +-----------------+------+-------+
    // | is minified     | no   | yes   |
    // +-----------------+------+-------+
    // | load source map | yes  | no    |
    // +-----------------+------+-------+
    var debug = true;

    // ---------------------------------------------------------------------------------------------------------------

    var urlParam = function (name) {
        var nameEsc = name.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        var results = new RegExp('[\?&]' + nameEsc + '=([^&#]*)').exec(window.location.href);
        return results ? decodeURIComponent(results[1]) : null;
    };

    // ---------------------------------------------------------------------------------------------------------------

    var loadScript = function (mode, src) {

        if (mode === "files-src") {
            // create tag <files src="xx"></files>
            // - browser loads source map - useful for debugging
            var scripts = document.getElementById("files");
            var ref = document.createElement("files");

            ref.setAttribute("src", src);
            scripts.appendChild(ref);

            // jQuery alert!
            // $("<files>", {src: src}).appendTo("#files"); code is misleading
            // it loads file using xhr, and then execute jQuery.DOMEval method
            // discussed at stackoverflow: http://stackoverflow.com/q/15459218

            return new $.Deferred().resolve();

        } else if (mode === "files-text") {
            // create tag <files>code</source>
            // - browser does _not_ load source map - useful for production
            // - sourceMappingURL comment need not be removed

            return $.ajax({dataType: "files", cache: true, url: src});
        }
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

    var modes = {
        "ss": "files-src",
        "st": "files-text"
    };

    var scripts = {
        "7t": [
            "app.es7-ts.js"
        ],
        "7b": [
            "app.es7-babel.min.js"
        ],
        "5b": [
            "lib/babel-polyfill/polyfill.min.js",
            "app.es5-babel.min.js"
        ],
        "5c": [
            "lib/babel-polyfill/polyfill.min.js",
            "app.es5-closure.min.js"
        ],
    };

    var mode = requireValid(urlParam("m"), Object.keys(modes), debug ? "ss" : "st");
    var files = requireValid(urlParam("v"), Object.keys(scripts), debug ? "7t" : "5b");

    var mode_ = modes[mode];
    var files_ = scripts[files];

    // ---------------------------------------------------------------------------------------------------------------

    var deferred = new $.Deferred();
    var pipe = deferred;

    $.each(files_, function (i, val) {
        pipe = pipe.pipe(function () {
            return loadScript(mode_, "js/" + val)
                .then(function () {
                    if (debug) {
                        console.log("app.loader(ok): " + val)
                    }
                }, function () {
                    if (debug) {
                        console.log("app.loader(fail): " + val)
                    }
                });
        });
    });

    deferred.resolve();
});
