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

    var load = function (mode, src) {
        if (mode == "doc") {
            var ref = document.createElement("script");
            ref.setAttribute("type", "text/javascript");
            ref.setAttribute("src", src);
            document.getElementsByTagName("footer")[0].appendChild(ref);

        } else if (mode == "ajax") {
            jQuery.ajax({
                dataType: "script",
                cache: true,
                url: src
            });
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

    var modes = ["doc", "ajax"];
    var versions = ["es6", "es6.min", "es5", "es5.min"];

    var modeParam = urlParam("mode");
    var versionParam = urlParam("v");

    var mode = fix(modes, modeParam);
    var version = fix(versions, versionParam);

    // ---------------------------------------------------------------------------------------------------------------

    load(mode, "js/app." + version + ".js");
});
