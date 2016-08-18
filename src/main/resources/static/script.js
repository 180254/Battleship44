"use strict";

// credits: friends @ stackoverflow
// url: http://stackoverflow.com/a/10727155
// license: cc by-sa 3.0
// license url: https://creativecommons.org/licenses/by-sa/3.0/
var random_string = function (length, chars) {
    var mask = "";
    if (chars.indexOf("a") > -1) mask += "abcdefghijklmnopqrstuvwxyz";
    if (chars.indexOf("A") > -1) mask += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (chars.indexOf("0") > -1) mask += "0123456789";
    if (chars.indexOf("!") > -1) mask += "~`!@#$%^&*()_+-={}[]:\";\'<>?,./|\\";

    var result = "";
    for (var i = length; i > 0; --i) {
        result += mask[Math.floor(Math.random() * mask.length)];
    }
    return result;
};

//source: http://snipplr.com/view/26662/get-url-parameters-with-jquery--improved/
var url_param = function (name) {
    var results = new RegExp("[\\?&]" + name + "=([^&#]*)").exec(window.location.href);
    return results ? results[1] : null;
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
        "data-col-i": col_i
    });
};

// -------------------------------------------------------------------------------------------------------------------

var set_cell_class = function (grid_id, row_i, col_i, new_class, remove_old_class) {
    var $element = $(grid_id)
        .find("tr").eq(row_i)
        .find("td").eq(col_i);

    if(remove_old_class) $element.removeClass();
    $element.addClass(new_class);
};

// -------------------------------------------------------------------------------------------------------------------

var ship_selection_activate = function () {
    var grid_id = "#grid-shoot";
    var isMouseDown = false;
    var isHighlighted = false;

    $(grid_id).find("td")
        .mousedown(function () {
            isMouseDown = true;
            $(this).toggleClass("ship");
            isHighlighted = $(this).hasClass("ship");
            $(this).toggleClass("unknown", !isHighlighted);
            return false;
        })

        .mouseover(function () {
            if (isMouseDown) {
                $(this).toggleClass("ship", isHighlighted);
                $(this).toggleClass("unknown", !isHighlighted);
            }
        })

        .on("selectstart", function () {
            return false;
        });

    $(document)
        .mouseup(function () {
            isMouseDown = false;
        });

    $("#msg-const").find("a").click(function () {
        ws_send("GRID " + ship_selection_collect());
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

var ship_selection_move = function() {
    var shoot = $("#grid-shoot").find("td");
    var opponent = $("#grid-opponent").find("td");

    for(var i = 0; i < shoot.length; i++) {
        var clazz = shoot.eq(i).attr("class");
        shoot.eq(i).attr("class", "unknown");
        opponent.eq(i).attr("class", clazz);
    }
};

// -------------------------------------------------------------------------------------------------------------------

var shoot_onetime_activate = function(calllback) {
    var grid_id = "#grid-shoot";
    var $cells = $(grid_id).find("td");

    $cells.on("click.shoot", function() {
        $cells.off("click.shoot");

        var dis = $(this);
        var cell = cell_serialize(dis.attr("data-row-i"), dis.attr("data-col-i"));
        calllback(cell);
    });
};

// -------------------------------------------------------------------------------------------------------------------

var reset_grids = function() {
    $("#grid-shoot").find("td").attr("class", "unknown");
    $("#grid-opponent").find("td").attr("class", "unknown");
};

var reset_activate_button = function(calllback) {
    var $clickable = $("#game-next-ok");

    $clickable.on("click.ok", function() {
        $clickable.off("click.ok");
        calllback();
    });
};

var reset_activate = function(callback) {
    message_append_button("next game?", "game-next-ok");
    reset_activate_button(callback);
};

// -------------------------------------------------------------------------------------------------------------------

var cell_serialize = function(row_i, col_i) {
    // [0,2]
    return "[" + row_i + "," + col_i   + "]";
};

var cell_deserialize = function(cell) {
    // [HIT,0,2]
    var cell_a = cell.replace(/[\[\]]/g, "");
    var cell_b = cell_a.split(",");

    return {
        "clazz": cell_b[0].toLowerCase(),
        "row_i": cell_b[1],
        "col_i": cell_b[2]
    };
};

var cells_deserialize = function(cells) {
    // [HIT,0,2],[EMPTY,2,1],[EMPTY,2,2]
    var cells_ar = cells.split("],");
    return $.map(cells_ar, function(n) {
        return cell_deserialize(n) ;
    });
};

// -------------------------------------------------------------------------------------------------------------------

var msg_timeout = {
    "fast": 1000,
    "default": 2000,
    "slow": 3000
};

var set_message = function (message, timeout, clazz) {
    var id = timeout
    ? random_string(7, "a0")
    : "msg-const";

    var span = $("<span/>", {
        "id": id,
        "text": message,
        "class": clazz
    });

    if (timeout) {
        setTimeout(function () {
            $("#" + id).fadeOut("fast", function () {
                $("#" + id).remove();
            });
        }, timeout);
    } else {
        $("#msg-const").remove();
    }

    $("#message").append(span);

};

var message_append_button = function (text, id) {
    $("#msg-const").append($("<a/>", {
        "text": text,
        "href": "#",
        "id": id
    }));
};

// -------------------------------------------------------------------------------------------------------------------

var init = function () {
    $("#grid-opponent").append(fresh_grid("grid-opponent", 10, 10));
    $("#grid-shoot").append(fresh_grid("grid-shoot", 10, 10));

    if (!("WebSocket" in window)) {
        set_message("WebSockets is not supported by your browser, google it.");
        return;
    }

    ws_go_game();
};

var ws = undefined;
var ws_go_game = function () {
    ws = new WebSocket("ws://" + window.location.host + "/ws");

    ws.onopen = function () {
        console.log("ws.onopen");
        var id = url_param("id") || "NEW";
        ws_send("GAME " + id);
    };

    ws.onmessage = function (evt) {
        var received_msg = evt.data;
        console.log("ws.onmessage: " + received_msg);
        onMsg_auto(received_msg);
    };

    ws.onclose = function () {
        console.log("ws.onclose");
        onAction_onClose();
    };
};

var ws_send = function (msg) {
    console.log("ws.send: " + msg);
    ws.send(msg);
};

// -------------------------------------------------------------------------------------------------------------------

var err_translate = function (msg) {
    return msg;
};

var get_game_url = function (game_id) {
    return window.location.origin + "/?id=" + game_id;
};

// -------------------------------------------------------------------------------------------------------------------

var onAction_onClose = function () {
    set_message("WebSocket connection lost, reload page to renew connection.");
    ship_selection_deactivate();
};

// -------------------------------------------------------------------------------------------------------------------

var onMsg_hi = function (payload) {
    set_message("Hi message: " + payload, msg_timeout.fast);
};

var onMsg_gameOk = function (payload) {
    if(payload) {
        $("#game-url").text(get_game_url(payload));
    }

    reset_grids();
    set_message("Put your ships on right grid ... ");
    message_append_button("done?", "ship-sel-ok");
    ship_selection_activate();
};

var onMsg_gameFail = function (payload) {
    set_message("Game id error: " + err_translate(payload));
};

var onMsg_gridOk = function () {
    ship_selection_deactivate();
    ship_selection_move();
    set_message("Awaiting second player ...");
};

var onMsg_gridFail = function () {
    set_message("Grid verification: failed, check again.", msg_timeout.default, "msg-fail");
};

var onMsg_tourStart = function () {

};

var onMsg_tourYou = function () {
    shoot_onetime_activate(function(pos) {
        ws_send("SHOT " + pos);
    });
    set_message("Your shoot ...");
};

var onMsg_tourHe = function () {
    set_message("Opponent shoot ...");
};

var onMsg_you = function (payload) {
    var cells = cells_deserialize(payload);
    for(var i = 0; i < cells.length; i++) {
        set_cell_class("#grid-shoot", cells[i].row_i, cells[i].col_i, cells[i].clazz, true);
    }
};

var onMsg_he = function (payload) {
    var cells = cells_deserialize(payload);
    for(var i = 0; i < cells.length; i++) {
        set_cell_class("#grid-opponent", cells[i].row_i, cells[i].col_i, "opponent-shoot", false);
    }
};

var onMsg_won = function (payload) {
    var p1 = payload
        .replace("YOU", "You")
        .replace("HE", "Opponent");

    set_message("The end. " + p1 + " won. ");

    reset_activate(function() {
        onMsg_gameOk();
    });
};

var onMsg_1pla = function (payload) {
    var game_interrupted = payload === "game-interrupted";

    set_message("Your opponent has gone. ",
        game_interrupted ? null : msg_timeout.slow
    );

    if(game_interrupted) {
        reset_activate(function() {
            onMsg_gameOk();
        });
    }
};

var onMsg_2pla = function () {
    set_message("Two players in game.", msg_timeout.slow);
};

var onMsg_pong = function () {

};

var onMsg400 = function (payload) {
    set_message("fail: " + err_translate(payload));
};

var onMsg_other = function () {

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

        if (msg.lastIndexOf(funcName, 0) === 0) {
            var payload = msg.substring(funcName.length + 1);
            return func(payload);
        }
    }

    return onMsg_other(payload);
};


// -------------------------------------------------------------------------------------------------------------------

// GO!
init();
