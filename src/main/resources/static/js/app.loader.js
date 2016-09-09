// code: es5
$(function () {

    // credits: friends @ stackoverflow
    // url: http://stackoverflow.com/a/25359264
    // license: cc by-sa 3.0
    // license url: https://creativecommons.org/licenses/by-sa/3.0/
    var urlParam = function (name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        return results ? decodeURIComponent(results[1]) : null;
    };

    // ---------------------------------------------------------------------------------------------------------------

    // load script info:
    // #1 Do not set script tag content (text) instead of src attribute - chrome does not load source map then.
    // #2.1 jQuery is useless as #1 - see jQuery.DOMEval function, it creates script tag with text.
    // #2.2 Tested&debugged two ways (a,b) - in both DOMEval is used finally.
    // #2.a $("<script>", {src: src}).appendTo("footer");
    // #2.b jQuery.ajax({dataType: "script", cache: true, url: src});
    // #3 Problem discussed at stackoverflow: http://stackoverflow.com/q/15459218
    var load = function (mode, src) {
        if (mode == "script") {
            // no-jQuery explanation:
            // jQuery.appendTo() cannot be used as chrome does not load source map then
            // it not just append child if added tag is script
            // http://stackoverflow.com/a/22572876
            var ref = document.createElement("script");
            ref.setAttribute("src", src);
            document.getElementsByTagName("footer")[0].appendChild(ref);
        }
    };

    // ---------------------------------------------------------------------------------------------------------------

    // returns:
    // * element if array.contains(element)
    // * default array element (at index 0) if not
    var fix = function (array, element) {
        return element && array.indexOf(element) != -1
            ? element
            : array[0];
    };

    var modes = ["script"];
    var versions = ["es6", "es6.min", "es5", "es5.min"];

    var modeParam = urlParam("m");
    var versionParam = urlParam("v");

    var mode = fix(modes, modeParam);
    var version = fix(versions, versionParam);

    // ---------------------------------------------------------------------------------------------------------------

    load(mode, "js/app." + version + ".js");
});
