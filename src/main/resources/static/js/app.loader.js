// change app version. example: ?v=es5-closure.min
$(function () {
    // code: es5

    // credits: friends @ stackoverflow
    // url: http://stackoverflow.com/a/25359264
    // license: cc by-sa 3.0
    // license url: https://creativecommons.org/licenses/by-sa/3.0/
    var urlParam = function (name) {
        var nameEsc = name.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        var results = new RegExp('[\?&]' + nameEsc + '=([^&#]*)').exec(window.location.href);
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
    // * default value if not
    var requireValid = function (value, validArray) {
        return value && validArray.indexOf(value) !== -1
            ? value
            : validArray[0];
    };

    var modes = ["script"];
    var versions = ["es7-ts", "es7-babel.min", "es5-babel.min", "es5-closure.min"];

    var modeParam = urlParam("m");
    var versionParam = urlParam("v");

    var mode = requireValid(modeParam, modes);
    var version = requireValid(versionParam, versions);

    // ---------------------------------------------------------------------------------------------------------------

    load(mode, "js/app." + version + ".js");
});
