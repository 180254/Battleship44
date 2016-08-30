/*global Cookies*/
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

    get_url: function (id) {
        return window.location.origin + "/?id=" + id;
    },

    set: function (el_id, value) {
        $("#" + el_id).text(value);
    },

    increment: function (el_id) {
        var $el = $("#" + el_id);
        var prev = parseInt($el.text());
        $el.text(prev + 1);
    }
};

// -------------------------------------------------------------------------------------------------------------------

var i18n = {
    _cookie_name: "b44_lang",
    _attr_path: "i18n-path",
    _attr_params: "i18n-params",
    strings: undefined,
    supported: [
        { lang: "en", country: "us" },
        { lang: "pl", country: "pl" }
    ],

    lang: {
        get: function () {
            //noinspection JSUnresolvedVariable
            var lang = [].concat(
                Cookies.get(i18n._cookie_name)
                || window.navigator.language
                || window.navigator.languages
                || window.navigator.userLanguage
                || window.navigator.systemLanguage
            );

            var s_lang = i18n.supported[0];
            for (var i = 0; i < lang.length; i++) {
                // en-US to en; en_US to en; en to en
                var iso = lang[i].split(/[-_]/).shift().toLowerCase();

                var grep = $.grep(i18n.supported, function(e) {
                    return e.lang === iso;
                });

                if (grep.length > 0) {
                    s_lang = grep[0];
                    break;
                }
            }

            console.log("debug: lang.get - " + s_lang);
            return s_lang;
        },

        set: function (code) {
            console.log("debug: lang.set - " + code);
            Cookies.set(i18n._cookie_name, code);
        }
    },

    do: function (i18n_p) {
        var path_a = i18n_p.path.split(".");
        var params_a = i18n_p.params || [];
        var text = i18n.strings;

        while (path_a.length > 0) {
            var i = path_a.shift();
            text = text[i];
        }

        while (params_a.length > 0) {
            var k = params_a.shift();
            text = text.replace("{}", k);
        }

        return text;
    },

    set: function ($e, i18n_p) {
        var path = i18n_p ? i18n_p.path : null;
        var params = i18n_p ? i18n_p.params : null;

        if (path) $e.data(i18n._attr_path, path);
        else path = $e.data(i18n._attr_path);

        if (params) {
            params = [].concat(params);
            $e.data(i18n._attr_params, params);
        }
        else params = $e.data(i18n._attr_params) || [];

        $e.text(i18n.do(i18n.p(path, params)));
    },

    set_all: function () {
        title.set(i18n.p("title.standard"));

        $("[data-" + i18n._attr_path + "]").each(function () {
            i18n.set($(this));
        });
    },

    p: function (path, params) {
        return {
            path: path,
            params: params
        };
    },

    draw_flags: function() {
        var $flags = $("#flags");

        for(var i = 0; i< i18n.supported.length; i++) {
                var $flag = $("<img/>", {
                    src: "flag/" + i18n.supported[i].country + ".png",
                    alt: i18n.supported[i].lang
                });

                $flags.append($flag);
        }
    },

    init: function (error, callback) {
        var lang = i18n.lang.get();

        $.get("i18n/" + lang + ".json", function (data) {
            i18n.strings = data;
            if (callback) callback();
        }).fail(function () {
            if (error) error();
        });
    }
};


// -------------------------------------------------------------------------------------------------------------------

var title = {
    _blink_timeout: 1350,
    _blink_interval: undefined,

    set: function (i18n_p) {
        title._stop_blink();
        document.title = i18n.do(i18n_p);
    },

    set_blink: function (i18n_p, override) {
        var title_standard = i18n.do(i18n.p("title.standard"));
        var new_title = i18n.do(i18n_p);

        if (!title._blink_interval || override) {
            title._stop_blink();

            var state = 0;
            title._blink_interval = window.setInterval(function () {
                document.title = state ? title_standard : new_title;
                state = (state + 1) % 2;
            }, title._blink_timeout);
        }
    },

    _stop_blink: function () {
        if (title._blink_interval) {
            window.clearInterval(title._blink_interval);
        }
    }
};

// -------------------------------------------------------------------------------------------------------------------

var events = {

    on: function ($e, action, callback) {
        $e.on(action, function () {
            callback($(this));
        });
    },

    on_onetime: function ($e, action, callback) {
        var namespace = utils.random_string(7, "a");
        var event = action + "." + namespace;

        $e.on(event, function () {
            $e.off(event);
            callback($(this));
        });
    },

    off: function ($e, action) {
        $e.off(action);
    }
};


// -------------------------------------------------------------------------------------------------------------------

var clazz = {
    cell: {
        unknown: "unknown",
        empty: "empty",
        ship: "ship",
        opp_shoot: "opponent-shoot"
    },

    msg: {
        fail: "msg-fail",
        important: "msg-important"
    },

    inactive: "inactive"
};

// -------------------------------------------------------------------------------------------------------------------

var grid = {
    shoot: "grid-shoot",
    opponent: "grid-opponent",

    fresh: function (grid_id, rows_no, cols_no) {
        var $table = $("<table/>");

        for (var row_i = 0; row_i < rows_no; row_i++) {
            var new_row = grid._new_row(grid_id, row_i, cols_no);
            $table.append(new_row);
        }

        return $table;
    },

    _new_row: function (grid_id, row_i, cols_no) {
        var $row = $("<tr/>");

        for (var col = 0; col < cols_no; col++) {
            var new_cell = grid._new_cell(grid_id, row_i, col);
            $row.append(new_cell);
        }

        return $row;
    },

    _new_cell: function (grid_id, row_i, col_i) {
        return $("<td/>", {
            "class": clazz.cell.unknown,
            "data-grid-id": grid_id,
            "data-row-i": row_i,
            "data-col-i": col_i
        });
    },

    set_cell: function (grid_id, row_i, col_i, new_class, remove_old_class) {
        var $element = $("#" + grid_id)
            .find("tr").eq(row_i)
            .find("td").eq(col_i);

        if (remove_old_class) {
            $element.removeClass();
        }

        $element.addClass(new_class);
    },

    reset_both: function () {
        $("#" + grid.shoot).find("td").attr("class", clazz.cell.unknown);
        $("#" + grid.opponent).find("td").attr("class", clazz.cell.unknown);
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
                $(this).toggleClass(clazz.cell.ship);
                isHighlighted = $(this).hasClass(clazz.cell.ship);
                $(this).toggleClass(clazz.cell.unknown, !isHighlighted);
                return false;
            })

            .mouseover(function () {
                if (isMouseDown) {
                    $(this).toggleClass(clazz.cell.ship, isHighlighted);
                    $(this).toggleClass(clazz.cell.unknown, !isHighlighted);
                }
            })

            .on("selectstart", function () {
                return false;
            });

        $(document)
            .mouseup(function () {
                isMouseDown = false;
            });
    },

    deactivate: function () {
        $("#" + grid.shoot).find("td")
            .off("mousedown")
            .off("mouseover")
            .off("selectstart");
        $(document).off("mousedown");
    },

    collect: function () {
        return $("#" + grid.shoot)
            .find("tr").find("td")
            .map(function () {
                return $(this).hasClass(clazz.cell.ship) | 0;
            })
            .get()
            .join();
    },

    move: function () {
        var shoot = $("#" + grid.shoot).find("td");
        var opponent = $("#" + grid.opponent).find("td");

        for (var i = 0; i < shoot.length; i++) {
            var s_clazz = shoot.eq(i).attr("class");
            shoot.eq(i).attr("class", clazz.cell.unknown);
            opponent.eq(i).attr("class", s_clazz);
        }
    }
};

// -------------------------------------------------------------------------------------------------------------------

var serializer = {

    // [0,2]
    cell_serialize: function (row_i, col_i) {
        return "[" + row_i + "," + col_i + "]";
    },

    // [HIT,0,2]
    cell_deserialize: function (cell) {
        var cell_a = cell.replace(/[\[\]]/g, "");
        var cell_b = cell_a.split(",");

        return {
            "clazz": cell_b[0].toLowerCase(),
            "row_i": cell_b[1],
            "col_i": cell_b[2]
        };
    },

    // // [HIT,0,2],[EMPTY,2,1],[EMPTY,2,2]
    cells_deserialize: function (cells) {
        var cells_ar = cells.split("],");
        return $.map(cells_ar, function (n) {
            return serializer.cell_deserialize(n);
        });
    }
};

// -------------------------------------------------------------------------------------------------------------------

var message = {
    msg_div: "message",
    msg_const: "msg-const",

    timeout: {
        fast: 1500,
        default: 2500,
        slow: 5000
    },

    set: function (i18n_p, timeout, css_class) {
        var id = timeout ? utils.random_string(7, "a") : message.msg_const;

        var $span = $("<span/>", {
            "id": id,
            "class": css_class
        });
        i18n.set($span, i18n_p);

        if (timeout) {
            setTimeout(function () {
                $("#" + id).fadeOut("fast", function () {
                    $("#" + id).remove();
                });
            }, timeout);
        } else {
            $("#" + message.msg_const).remove();
        }

        $("#" + message.msg_div).append($span);
    },

    append_link: function (i18n_p, id) {
        var $a = $("<a/>", {
            "href": "#",
            "id": id
        });
        i18n.set($a, i18n_p);

        $("#" + message.msg_const).append($a);
    }
};

// -------------------------------------------------------------------------------------------------------------------


var game = {
    ok_next_game: "ok-game-next-",
    ok_ship_selection: "ok-ship-selection",

    init: function () {
        i18n.draw_flags();

        i18n.init(function () {
            console.log("game.init: i18n.init error");
        }, function () {
            i18n.set_all();

            $("#" + grid.shoot).append(grid.fresh(grid.shoot, 10, 10));
            $("#" + grid.opponent).append(grid.fresh(grid.opponent, 10, 10));

            if (!("WebSocket" in window)) {
                message.set(i18n.p("ws.unable"));
                return;
            }

            ws.init();
        });
    }
};


// -------------------------------------------------------------------------------------------------------------------

var info = {
    game_url: "info-game-url",
    players_game: "info-players-game",
    players_global: "info-players-global",
    winning_me: "info-winning-me",
    winning_opp: "info-winning-opp",

    stat: {
        "players": "info-players-global"
    }

};
// -------------------------------------------------------------------------------------------------------------------

var ws = {
    _ws: null,

    init: function () {
        ws._ws = new WebSocket("ws://" + window.location.host + "/ws");
        ws._ws.onopen = on_event_actions.onOpen;
        ws._ws.onmessage = on_event_actions.onMessage;
        ws._ws.onclose = on_event_actions.onClose;
        ws._ws.onerror = on_event_actions.onError;
    },

    send: function (msg) {
        ws._ws.send(msg);
        on_event_actions.onSend(msg);
    }
};


// -------------------------------------------------------------------------------------------------------------------

var err = {
    translate: function (msg) {
        return msg;
    }
};

// -------------------------------------------------------------------------------------------------------------------

var on_event_actions = {

    onOpen: function (evt) {
        console.log("ws.onopen   : " + evt.target.url);
        var id = utils.url_param("id") || "NEW";
        ws.send("GAME " + id);
    },

    onMessage: function (evt) {
        console.log("ws.onmessage: " + evt.data);
        on_msg_actions.auto(evt.data);
    },

    onClose: function (evt) {
        console.log("ws.onclose  : " + evt.code + "(" + evt.reason + ")");
        message.set(i18n.p("ws.close"), null, clazz.msg.fail);
        ship_selection.deactivate();
    },

    onError: function (evt) {
        console.log("ws.onclose  : " + evt.type);
        message.set(i18n.p("ws.error"), null, clazz.msg.fail);
    },

    onSend: function (msg) {
        console.log("ws.send     : " + msg);
    }
};

// -------------------------------------------------------------------------------------------------------------------

var on_msg_actions = {
    "HI_.": function (payload) {
        message.set(i18n.p("pre.hi", payload), message.timeout.fast);
    },

    "GAME OK": function (payload) {
        $("#" + grid.opponent).addClass(clazz.inactive);
        $("#" + grid.shoot).removeClass(clazz.inactive);

        if (payload) {
            utils.set(info.game_url, utils.get_url(payload));
            utils.set(info.players_game, 1);
        }

        grid.reset_both();

        message.set(i18n.p("put.info"));
        message.append_link(i18n.p("put.done"), game.ok_ship_selection);

        ship_selection.activate();
        events.on($("#" + game.ok_ship_selection), "click", function () {
            ws.send("GRID " + ship_selection.collect());
        });
    },

    "GAME FAIL": function (payload) {
        message.set(i18n.p("fail.fail", err.translate(payload)));
    },

    "GRID OK": function () {
        $("#" + grid.opponent).removeClass(clazz.inactive);
        $("#" + grid.shoot).addClass(clazz.inactive);

        message.set(i18n.p("tour.awaiting"));

        ship_selection.deactivate();
        ship_selection.move();
    },

    "GRID FAIL": function () {
        message.set(i18n.p("put.fail"), message.timeout.default, clazz.msg.fail);
    },

    "TOUR START": function () {
    },

    "TOUR YOU": function () {
        var $gs = $("#" + grid.shoot);
        $gs.removeClass(clazz.inactive);

        message.set(i18n.p("tour.shoot_me"), null, clazz.msg.important);
        title.set_blink(i18n.p("title.shoot_me"), false);

        events.on_onetime($gs.find("td"), "click", function (dis) {
            var pos = serializer.cell_serialize(dis.attr("data-row-i"), dis.attr("data-col-i"));
            ws.send("SHOT " + pos);
        });

    },

    "TOUR HE": function () {
        $("#" + grid.shoot).addClass(clazz.inactive);
        message.set(i18n.p("tour.shoot_opp"));
        title.set(i18n.p("title.shoot_opp"));
    },

    "YOU_": function (payload) {
        var cells = serializer.cells_deserialize(payload);

        for (var i = 0; i < cells.length; i++) {
            grid.set_cell(grid.shoot, cells[i].row_i, cells[i].col_i, cells[i].clazz, true);
        }
    },

    "HE__": function (payload) {
        var cells = serializer.cells_deserialize(payload);

        for (var i = 0; i < cells.length; i++) {
            grid.set_cell(grid.opponent, cells[i].row_i, cells[i].col_i, clazz.cell.opp_shoot, false);
        }
    },

    "WON_": function (payload) {
        $("#" + grid.opponent).addClass(clazz.inactive);
        $("#" + grid.shoot).addClass(clazz.inactive);

        utils.increment(payload === "YOU" ? info.winning_me : info.winning_opp);

        payload === "YOU"
            ? message.set(i18n.p("end.won_me"))
            : message.set(i18n.p("end.won_opp"));

        message.append_link(i18n.p("end.next_game"), game.ok_next_game);

        events.on_onetime($("#" + game.ok_next_game), "click", function () {
            on_msg_actions["GAME OK"]();
        });

        title.set(i18n.p("title.standard"));
    },


    "1PLA": function (payload) {
        utils.set(info.players_game, 1);
        var game_interrupted = payload === "game-interrupted";

        message.set(i18n.p("end.opp_gone"),
            game_interrupted ? null : message.timeout.slow
        );

        if (game_interrupted) {
            var $go = $("#" + grid.opponent);
            var $gs = $("#" + grid.shoot);

            events.off($gs.find("td"), "click"); // remove shoot action

            message.append_link(i18n.p("end.next_game"), game.ok_next_game);
            $go.addClass(clazz.inactive);
            $gs.addClass(clazz.inactive);

            title.set(i18n.p("title.standard"));
        }

        events.on_onetime($("#" + game.ok_next_game), "click", function () {
            on_msg_actions["GAME OK"]();
        });
    },

    "2PLA": function () {
        utils.set(info.players_game, 2);
        message.set(i18n.p("tour.two_players"), message.timeout.slow);
    },

    "PONG": function () {
    },

    "STAT": function (payload) {
        var stats = payload.split(",");

        for (var i = 0; i < stats.length; i++) {
            var stat = stats[i].split("=");
            $("#" + info.stat[stat[0]]).text(stat[1]);
        }

    },

    "400_": function (payload) {
        message.set(i18n.p("fail.fail", err.translate(payload)));
    },

    _other: function () {
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
