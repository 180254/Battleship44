$(function () {
    // code: es5

    // credits: friends @ stackoverflow
    // url: http://stackoverflow.com/a/25359264
    // license: cc by-sa 3.0
    // license url: https://creativecommons.org/licenses/by-sa/3.0/
    $.urlParam = function (name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        return results ? decodeURIComponent(results[1]) : null;
    };

    var supported = ["es6", "es6.min", "es5", "es5.min"];
    var vParam = $.urlParam("v");

    var vSelection = vParam && supported.indexOf(vParam) != -1
        ? vParam
        : supported[0];

    var ref = document.createElement("script");
    ref.setAttribute("type", "text/javascript");
    ref.setAttribute("src", "js/app." + vSelection + ".js");
    document.getElementsByTagName("footer")[0].appendChild(ref)
});
