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

// -------------------------------------------------------------------------------------------------------------------

var fresh_grid = function (grid_name, rows_no, cols_no) {
    var $table = $("<table/>");

    for (var row_i = 0; row_i < rows_no; row_i++) {
        var new_row = new_grid_row(grid_name, row_i, cols_no);
        $table.append(new_row);
    }

    return $table;

};

var new_grid_row = function (grid_name, row_i, cols_no) {
    var $row = $("<tr/>");

    for (var col = 0; col < cols_no; col++) {
        var new_cell = new_grid_cell(grid_name, row_i, col);
        $row.append(new_cell);
    }

    return $row;
};

var new_grid_cell = function (grid_name, row_i, col_i) {
    return $("<td/>", {
        "class": "unknown",
        "data-name": grid_name,
        "data-row-i": row_i,
        "data-cell-i": col_i
    });
};

// -------------------------------------------------------------------------------------------------------------------

var set_cell_class = function (grid_id, row_i, col_i, new_class) {
    var $element = $(grid_id)
        .find("tr").eq(row_i)
        .find("td").eq(col_i);

    $element.removeClass();
    $element.addClass(new_class);
};

// -------------------------------------------------------------------------------------------------------------------

var ship_selection_activate = function () {
    var grid_id = "#grid-shoot";
    var clazz = "ship";
    var isMouseDown = false;
    var isHighlighted = false;

    $(grid_id).find("td")
        .mousedown(function () {
            isMouseDown = true;
            $(this).toggleClass(clazz);
            isHighlighted = $(this).hasClass(clazz);
            return false;
        })

        .mouseover(function () {
            if (isMouseDown) {
                $(this).toggleClass(clazz, isHighlighted);
            }
        })

        .on("selectstart", function () {
            return false;
        });

    $(document)
        .mouseup(function () {
            isMouseDown = false;
        });
};

var ship_selection_deactivate = function () {
    var grid_id = "#grid-shoot";

    $(grid_id).find("td")
        .off("mousedown")
        .off("mouseover")
        .off("selectstart");
    $(document).off("mousedown");
};

var ship_selection_collect = function () {
    var grid_id = "#grid-shoot";
    var clazz = "ship";

    return $(grid_id)
        .find("tr").find("td")
        .map(function () {
            return $(this).hasClass(clazz) | 0;
        })
        .get()
        .join();
};

// -------------------------------------------------------------------------------------------------------------------

var set_message = function (message, timeout) {
    $("#msg-connecting").remove();

    if (timeout === undefined) {
        $("#msg-const").text(message);

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

// -------------------------------------------------------------------------------------------------------------------

var init = function () {
    $("#grid-opponent").append(fresh_grid("grid-opponent", 10, 10));
    $("#grid-shoot").append(fresh_grid("grid-shoot", 10, 10));

    if (!("WebSocket" in window)) {
        set_message("WebSockets not supported, google it");
        return;
    }

    ws_go_game();
};

var ws = undefined;
var ws_go_game = function () {
    ws = new WebSocket("ws://" + window.location.host + "/ws");

    ws.onopen = function () {
        var id = url_param("id") || "NEW";
        ws_send("GAME " + id)
    };

    ws.onmessage = function (evt) {
        var received_msg = evt.data;
        console.log("ws.onmessage: " + received_msg);
        set_message("ws.onmessage: " + received_msg);

        onMsg_auto(received_msg);
    };

    ws.onclose = function () {
        console.log("ws.onclose");
        set_message("ws.onclose");
    };
};

var ws_send = function (msg) {
    console.log("ws.send: " + msg);
    ws.send(msg)
};

// -------------------------------------------------------------------------------------------------------------------

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

var onMsg_auto = function (msg) {
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


// -------------------------------------------------------------------------------------------------------------------

// GO!
init();

// -------------------------------------------------------------------------------------------------------------------

//
//set_cell_class("grid-shoot", 0, 0, "empty");
//set_cell_class("grid-shoot", 0, 1, "empty");
//set_cell_class("grid-shoot", 0, 2, "empty");
//set_cell_class("grid-shoot", 0, 3, "empty");
//
//set_cell_class("grid-shoot", 1, 0, "ship");
//set_cell_class("grid-shoot", 1, 1, "ship");
//set_cell_class("grid-shoot", 1, 2, "ship");
//set_cell_class("grid-shoot", 1, 3, "ship");