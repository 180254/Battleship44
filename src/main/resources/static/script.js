"use strict";

var utils = {
    // credits: friends @ stackoverflow
    // url: http://stackoverflow.com/a/10727155
    // license: cc by-sa 3.0
    // license url: https://creativecommons.org/licenses/by-sa/3.0/
    random_string: function (length, chars) {
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
    },

    // credits/source: http://snipplr.com/view/26662/get-url-parameters-with-jquery--improved/
    url_param: function (name) {
        var results = new RegExp("[\\?&]" + name + "=([^&#]*)").exec(window.location.href);
        return results ? results[1] : null;
    },

    get_url: function(id) {
        return window.location.origin + "/?id=" + id;
    }
};


// -------------------------------------------------------------------------------------------------------------------

var clazz = {
    unknown: "unknown",
    empty: "empty",
    ship: "ship",
    opponent_shoot: "opponent-shoot"
};

// -------------------------------------------------------------------------------------------------------------------

var grid = {
    shoot: "grid_shoot",
    opponent: "grid_opponent",

    fresh: function(grid_id, rows_no, cols_no) {
        var $table = $("<table/>");

        for (var row_i = 0; row_i < rows_no; row_i++) {
            var new_row = grid._new_row(grid_id, row_i, cols_no);
            $table.append(new_row);
        }

        return $table;
    },

    _new_row: function(grid_id, row_i, cols_no) {
        var $row = $("<tr/>");

        for (var col = 0; col < cols_no; col++) {
            var new_cell = grid._new_cell(grid_id, row_i, col);
            $row.append(new_cell);
        }

        return $row;
    },

    _new_cell: function(grid_id, row_i, col_i) {
        return $("<td/>", {
            "class": clazz.unknown,
            "data-grid-id": grid_id,
            "data-row-i": row_i,
            "data-col-i": col_i
        });
    },

    set_cell: function (grid_id, row_i, col_i, new_class, remove_old_class) {
        var $element = $("#" + grid_id)
            .find("tr").eq(row_i)
            .find("td").eq(col_i);

        if(remove_old_class) {
            $element.removeClass();
        }

        $element.addClass(new_class);
    },

    reset_both: function() {
        $("#" + grid.shoot).find("td").attr("class", clazz.unknown);
        $("#" + grid.opponent).find("td").attr("class", clazz.unknown);
    }
};

// -------------------------------------------------------------------------------------------------------------------

var ship_selection = {

    activate: function () {
        var isMouseDown = false;
        var isHighlighted = false;

        $("#" + grid.shoot).find("td")
            .mousedown(function () {
                isMouseDown = true;
                $(this).toggleClass(clazz.ship);
                isHighlighted = $(this).hasClass(clazz.ship);
                $(this).toggleClass(clazz.unknown, !isHighlighted);
                return false;
            })

            .mouseover(function () {
                if (isMouseDown) {
                    $(this).toggleClass(clazz.ship, isHighlighted);
                    $(this).toggleClass(clazz.unknown, !isHighlighted);
                }
            })

            .on("selectstart", function () {
                return false;
            });

        $(document)
            .mouseup(function () {
                isMouseDown = false;
            });

            // TODO: refactor to callback
        $("#msg-const").find("a").click(function () {
            ws_send("GRID " + ship_selection._collect());
        });
    },

    deactivate: function() {
        $("#" + grid.shoot).find("td")
            .off("mousedown")
            .off("mouseover")
            .off("selectstart");
        $(document).off("mousedown");
    },

    _collect: function() {
        return $("#" + grid.shoot)
            .find("tr").find("td")
            .map(function () { return $(this).hasClass(clazz.ship) | 0; })
            .get()
            .join();
    },

    move: function() {
        var shoot = $("#" + grid.shoot).find("td");
        var opponent = $("#" + grid.opponent).find("td");

        for(var i = 0; i < shoot.length; i++) {
            var clazz = shoot.eq(i).attr("class");
            shoot.eq(i).attr("class", clazz.unknown);
            opponent.eq(i).attr("class", clazz);
        }
    }
};

// -------------------------------------------------------------------------------------------------------------------

var shoot = {

    activate_onetime: function(callback) {
        var $cells = $("#" + grid.shoot).find("td");

        $cells.on("click.shoot", function() {
            $cells.off("click.shoot");

            var dis = $(this);
            var cell = serializer.cell_serialize(dis.attr("data-row-i"), dis.attr("data-col-i"));
            callback(cell);
        });
    }
};

// -------------------------------------------------------------------------------------------------------------------

var serializer = {

    // [0,2]
    cell_serialize: function(row_i, col_i) {
        return "[" + row_i + "," + col_i   + "]";
    },

    // [HIT,0,2]
    cell_deserialize: function(cell) {
        var cell_a = cell.replace(/[\[\]]/g, "");
        var cell_b = cell_a.split(",");

        return {
            "clazz": cell_b[0].toLowerCase(),
            "row_i": cell_b[1],
            "col_i": cell_b[2]
        };
    },

    // // [HIT,0,2],[EMPTY,2,1],[EMPTY,2,2]
    cells_deserialize: function(cells) {
        var cells_ar = cells.split("],");
        return $.map(cells_ar, function(n) {
            return serializer.cell_deserialize(n) ;
        });
    }
};

// -------------------------------------------------------------------------------------------------------------------

var message = {
    msg_div: "message",
    msg_const: "msg-const",

    timeout: {
        "fast": 1000,
        "default": 2000,
        "slow": 3000
    },

    set: function (message, timeout, clazz) {
        var id = timeout ? utils.random_string(7, "a0") : message.msg_const;

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
            $("#" +  message.msg_const).remove();
        }

        $("#" + message.msg_div).append(span);
    },

    append_link: function (text, id) {
        $("#" +  message.msg_const).append($("<a/>", {
            "text": text,
            "href": "#",
            "id": id
        }));
    }
};

// -------------------------------------------------------------------------------------------------------------------


var game = {
    next_id: "game-next-ok",

    init: function() {
        $("#" + grid.shoot).append(grid.fresh(grid.shoot, 10, 10));
        $("#" + grid.opponent).append(grid.fresh(grid.opponent, 10, 10));

        if (!("WebSocket" in window)) {
            message.set("WebSockets is not supported by your browser, google it.");
            return;
        }

        ws_go_game();
    },

    activate_reset: function(callback) {
        var $clickable = $("#" + game.next_id);

        $clickable.on("click.ok", function() {
            $clickable.off("click.ok");
            callback();
        });
    }
};

// -------------------------------------------------------------------------------------------------------------------

var ws = undefined;
var ws_go_game = function () {
    ws = new WebSocket("ws://" + window.location.host + "/ws");

    ws.onopen = function () {
        on_event_actions.onOpen();
    };

    ws.onmessage = function (evt) {
        on_event_actions.onMessage(evt);
    };

    ws.onclose = function () {
        on_event_actions.onClose();
    };
};

var ws_send = function (msg) {
    ws.send(msg);
    on_event_actions.onSend(msg);
};

// -------------------------------------------------------------------------------------------------------------------

var err = {
    translate: function (msg) {
        return msg;
    }
};

// -------------------------------------------------------------------------------------------------------------------

var on_event_actions = {

    onOpen:function() {
        console.log("ws.onopen");
        var id = utils.url_param("id") || "NEW";
        ws_send("GAME " + id);
    },

    onMessage: function(evt) {
        var received_msg = evt.data;
        console.log("ws.onmessage: " + received_msg);
        on_msg_actions.auto(received_msg);
    },

    onClose: function() {
        console.log("ws.onclose");
        message.set("WebSocket connection lost, reload page to renew connection.");
        ship_selection.deactivate();
    },

    onSend: function(msg) {
        console.log("ws.send: " + msg);
    }
};

// -------------------------------------------------------------------------------------------------------------------

var on_msg_actions = {
    "HI_.": function (payload) {
        message.set("Hi message: " + payload, message.timeout.fast);
    },

    "GAME OK": function (payload) {
        if(payload) {
            $("#game-url").text(utils.set_game_url(payload));
        }

        grid.reset_both();
        message.set("Put your ships on right grid ... ");
        message.append_link("done?", "ship-sel-ok");
        ship_selection.activate();
    },

    "GAME FAIL":function (payload) {
        message.set("Game id error: " + err.translate(payload));
    },

    "GRID OK": function () {
        ship_selection.deactivate();
        ship_selection.move();
        message.set("Awaiting second player ...");
    },

    "GRID FAIL": function() {
            message.set("Grid verification: failed, check again.", message.timeout.default, "msg-fail");
    },

    "TOUR START": function() {
    },

    "TOUR YOU": function () {
        shoot.activate.onetime(function(pos) {
            ws_send("SHOT " + pos);
        });

        message.set("Your shoot ...");
    },

    "TOUR HE": function () {
        message.set("Opponent shoot ...");
    },

    "YOU_": function (payload) {
        var cells = serializer.cells_deserialize(payload);

        for(var i = 0; i < cells.length; i++) {
            grid.set_cell(grid.shoot, cells[i].row_i, cells[i].col_i, cells[i].clazz, true);
        }
    },

    "HE__": function (payload) {
        var cells = serializer.cells_deserialize(payload);

        for(var i = 0; i < cells.length; i++) {
            grid.set_cell(grid.opponent, cells[i].row_i, cells[i].col_i, "opponent-shoot", false);
        }
    },


    "WON_": function (payload) {
        var player = payload
            .replace("YOU", "You")
            .replace("HE", "Opponent");

        message.set("The end. " + player + " won. ");

        message.append_link("next game?", game.next_id);
        game.activate_reset(function() {
            on_msg_actions["GAME OK"]();
        });
    },


    "1PLA":  function (payload) {
        var game_interrupted = payload === "game-interrupted";

        message.set("Your opponent has gone. ",
            game_interrupted ? null : message.timeout.slow
        );

        message.append_link("next game?", game.next_id);
        game.activate_reset(function() {
            on_msg_actions["GAME OK"]();
         });
     },


    "2PLA": function() {
        message.set("Two players in game.", message.timeout.slow);
    },

    "PONG": function() {
    },

    "400_": function(payload) {
        message.set("Fail: " + err.translate(payload));
    },

    _other: function() {
    },

    auto: function (msg) {
        var funcNames = Object.keys(on_msg_actions);

        for (var i = 0; i < funcNames.length; i++) {
            var funcName = funcNames[i];
            var func = on_msg_actions[funcNames[i]];

            if (msg.lastIndexOf(funcName, 0) === 0) {
                var payload = msg.substring(funcName.length + 1);
                return func(payload);
            }
        }

        return on_msg_actions._other(payload);
    }
};

// -------------------------------------------------------------------------------------------------------------------

// GO!
game.init();
