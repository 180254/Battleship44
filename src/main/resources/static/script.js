//source: http://snipplr.com/view/26662/get-url-parameters-with-jquery--improved/
var urlParam = function (name) {
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (!results) return null;
    return results[1];
};

var freshGrid = function (rows, cols) {
    var $table = $("<table/>");

    for (var row = 0; row < rows; row++) {
        $table.append(newGridRow(cols));
    }

    return $table;

};

var newGridRow = function (cols) {
    var $row = $("<tr/>");

    for (var col = 0; col < cols; col++) {
        $row.append(newGridCell());
    }

    return $row;
};

var newGridCell = function () {
    return $("<td/>", {
        "class": "unknown"
    });
};


var setCell = function (gridId, row, col, newClass) {
    var selector = "#" + gridId + " tr:eq(" + (row) + ") td:eq(" + (col) + ")";
    var $el = $(selector);
    $el.removeClass();
    $el.addClass(newClass);
};


var setMessage = function (message) {
    console.log(message);
    $("#message").text(message);
};

var init = function () {
    $("#grid-opponent").append(freshGrid(10, 10));
    $("#grid-shoot").append(freshGrid(10, 10));

    if (!("WebSocket" in window)) {
        setMessage("WebSockets not supported, google it");
        return;
    }

    goGame();
};

var goGame = function () {
    var ws = new WebSocket("ws://" + window.location.host + "/ws");

    ws.onopen = function () {
        var id = urlParam("id") || "NEW";
        ws.send("GAME " + id)
    };

    ws.onmessage = function (evt) {
        var received_msg = evt.data;
        setMessage("onmessage: " + received_msg);

    };

    ws.onclose = function () {
        setMessage("onclose");
    };
};

init();

setCell("grid-shoot", 0, 0, "empty");
setCell("grid-shoot", 0, 1, "empty");
setCell("grid-shoot", 0, 2, "empty");
setCell("grid-shoot", 0, 3, "empty");

setCell("grid-shoot", 1, 0, "ship");
setCell("grid-shoot", 1, 1, "ship");
setCell("grid-shoot", 1, 2, "ship");
setCell("grid-shoot", 1, 3, "ship");