// app loader. possible to change loaded .js version
// proper versions: ["es6", "es6.min", "es5", "es5.min"]
// change version by "v" GET param
// example: ?v=es5.min
$(function () {
    // code: es5

    // credits: friends @ stackoverflow
    // url: http://stackoverflow.com/a/25359264
    // license: cc by-sa 3.0
    // license url: https://creativecommons.org/licenses/by-sa/3.0/
    var urlParam = function (name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        return results ? decodeURIComponent(results[1]) : null;
    };

    // ---------------------------------------------------------------------------------------------------------------

    // Load script info:
    // #1 Do not set script tag content (text) instead of src attribute - chrome does not load source map then.
    // #2.1 jQuery is useless as #1 - see jQuery.DOMEval function, it creates script tag with text.
    // #2.2 Tested&debugged two ways (a,b) - in both DOMEval is used finally.
    // #2.a $("<script>", {src: src}).appendTo("footer");
    // #2.b jQuery.ajax({dataType: "script", cache: true, url: src});
    // #3 Problem discussed at stackoverflow: http://stackoverflow.com/q/15459218
    var load = function (mode, src) {
        if (mode == "script") {
            var scripts = document.getElementById("scripts");
            var ref = document.createElement("script");

            ref.setAttribute("src", src);
            scripts.appendChild(ref);
        }
    };

    // ---------------------------------------------------------------------------------------------------------------

    // returns:
    // * value if validArray.contains(value)
    // * default array value (at index 0) if not
    var requireValid = function (validArray, value) {
        return value && validArray.indexOf(value) != -1
            ? value
            : validArray[0];
    };

    var modes = ["script"];
    var versions = ["es6", "es6.min", "es5", "es5.min"];

    var modeParam = urlParam("m");
    var versionParam = urlParam("v");

    var mode = requireValid(modes, modeParam);
    var version = requireValid(versions, versionParam);

    // ---------------------------------------------------------------------------------------------------------------

    load(mode, "js/app." + version + ".js");
});
