// credits: friends @ stackoverflow
// url: http://stackoverflow.com/a/10727155
// license: cc by-sa 3.0
// license url: https://creativecommons.org/licenses/by-sa/3.0/
var random_string = function (length, chars) {
    var mask = '';
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('0') > -1) mask += '0123456789';
    if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';

    var result = '';
    for (var i = length; i > 0; --i) {
        result += mask[Math.floor(Math.random() * mask.length)];
    }
    return result;
};

//source: http://snipplr.com/view/26662/get-url-parameters-with-jquery--improved/
var url_param = function (name) {
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (!results) return null;
    return results[1];
};

var fresh_grid = function (rows, cols) {
    var $table = $("<table/>");

    for (var row = 0; row < rows; row++) {
        $table.append(new_grid_row(cols));
    }

    return $table;

};

var new_grid_row = function (cols) {
    var $row = $("<tr/>");

    for (var col = 0; col < cols; col++) {
        $row.append(new_grid_cell());
    }

    return $row;
};

var new_grid_cell = function () {
    return $("<td/>", {
        "class": "unknown"
    });
};


var set_cell = function (gridId, row, col, newClass) {
    var selector = "#" + gridId + " tr:eq(" + (row) + ") td:eq(" + (col) + ")";
    var $element = $(selector);

    $element.removeClass();
    $element.addClass(newClass);
};


var set_message = function (message, timeout) {
    $("#connecting").remove();
    console.log("set: " + message);

    if (timeout === undefined) {
        $("#message#cont-msg").text(message);

    } else {
        var id = random_string(7, "a0");

        var span = $("<span/>", {
            "id": id,
            "text": message
        });

        setTimeout(function () {
            $("#" + id).fadeOut("fast", function () {
                $("#" + id).remove();
            });
        }, timeout);

        $("#message").append(span);
    }
};

var init = function () {
    $("#grid-opponent").append(fresh_grid(10, 10));
    $("#grid-shoot").append(fresh_grid(10, 10));

    if (!("WebSocket" in window)) {
        set_message("WebSockets not supported, google it");
        return;
    }

    go_game();
};

var onMsg_hi = function (payload) {

};

var onMsg_gameOk = function (payload) {

};

var onMsg_gameFail = function (payload) {

};

var onMsg_gridOk = function (payload) {

};

var onMsg_gridFail = function (payload) {

};

var onMsg_tourStart = function (payload) {

};

var onMsg_tourYou = function (payload) {

};

var onMsg_tourHe = function (payload) {

};

var onMsg_you = function (payload) {

};

var onMsg_he = function (payload) {

};

var onMsg_won = function (payload) {

};

var onMsg_1pla = function (payload) {

};

var onMsg_2pla = function (payload) {

};

var onMsg_pong = function (payload) {

};

var onMsg400 = function (payload) {

};

var onMsg_other = function (payload) {

};

var functions = {
    "HI_.": onMsg_hi,
    "GAME OK": onMsg_gameOk,
    "GAME FAIL": onMsg_gameFail,
    "GRID OK": onMsg_gridOk,
    "GRID FAIL": onMsg_gridFail,
    "TOUR START": onMsg_tourStart,
    "TOUR YOU": onMsg_tourYou,
    "TOUR HE": onMsg_tourHe,
    "YOU_": onMsg_you,
    "HE__": onMsg_he,
    "WON_": onMsg_won,
    "1PLA": onMsg_1pla,
    "2PLA": onMsg_2pla,
    "PONG": onMsg_pong,
    "400_": onMsg400
};

var functions_detect = function (msg) {
    var funcNames = Object.keys(functions);

    for (var i = 0; i < funcNames.length; i++) {
        var funcName = funcNames[i];
        var func = functions[funcNames[i]];

        if (msg.lastIndexOf(funcNames, 0) === 0) {
            var payload = msg.substring(0, funcName.length);
            return func(payload);
        }
    }

    return onMsg_other(payload);
};

var go_game = function () {
    var ws = new WebSocket("ws://" + window.location.host + "/ws");

    ws.onopen = function () {
        var id = url_param("id") || "NEW";
        ws.send("GAME " + id)
    };

    ws.onmessage = function (evt) {
        var received_msg = evt.data;
        functions_detect(received_msg);
        set_message("onmessage: " + received_msg, 3000);

    };

    ws.onclose = function () {
        set_message("onclose");
    };
};

init();

set_cell("grid-shoot", 0, 0, "empty");
set_cell("grid-shoot", 0, 1, "empty");
set_cell("grid-shoot", 0, 2, "empty");
set_cell("grid-shoot", 0, 3, "empty");

set_cell("grid-shoot", 1, 0, "ship");
set_cell("grid-shoot", 1, 1, "ship");
set_cell("grid-shoot", 1, 2, "ship");
set_cell("grid-shoot", 1, 3, "ship");