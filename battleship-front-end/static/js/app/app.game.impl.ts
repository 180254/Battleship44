/// <reference types="jquery" />
/// <reference types="jqueryui" />
/// <reference types="js-cookie" />
/// <reference path="app.game.decl.ts" />
/// <reference path="app.loader.decl.ts" />
/// <reference path="assert.impl.ts" />
/// <reference path="escape.impl.ts" />
/// <reference path="event0.impl.ts" />
/// <reference path="event1.impl.ts" />
/// <reference path="format.impl.ts" />
/// <reference path="grid.impl.ts" />
/// <reference path="i18n.impl.ts" />
/// <reference path="logger.impl.ts" />
/// <reference path="message.impl.ts" />
/// <reference path="random.impl.ts" />
/// <reference path="serializer.impl.ts" />
/// <reference path="strings.impl.ts" />
/// <reference path="title.impl.ts" />
/// <reference path="types.decl.ts" />
/// <reference path="ui.impl.ts" />
/// <reference path="url.impl.ts" />

// extend EventTarget; url is given in event on WebSocket open
interface EventTarget {
    readonly url?: string;
}

namespace game {
    "use strict";

    class Singleton {

        public assert: assert.AssertEx = new assert.AssertEx();
        public random: random.RandomEx = new random.RandomEx();
        public event1: event1.EventEx = new event1.EventEx(this.random);
        public url: url.UrlEx = new url.UrlEx();

        public grids: grid.GridsEx = new grid.GridsEx();
        public selection: grid.SelectionEx = new grid.SelectionEx(this.grids);

        public langTagCmp: i18n.LangTagComparisonEx = new i18n.LangTagComparisonEx();
        public langFinder: i18n.LangFinderEx = new i18n.LangFinderEx();
        public langSelector: i18n.LangSelectorEx = new i18n.LangSelectorEx(this.langFinder, this.langTagCmp);
        public langSetter: i18n.LangSetterEx = new i18n.LangSetterEx(this.langSelector);
        public translator: i18n.TranslatorEx = new i18n.TranslatorEx(this.langSetter, new event0.EventEx());

        public timeout: message.TimeoutEx = new message.TimeoutEx();
        public message: message.MessageEx = new message.MessageEx(this.random, this.translator);
        public title: title.TitleEx = new title.TitleEx(this.translator);
        public ui: ui.UiEx = new ui.UiEx(this.event1, this.langFinder);

        public cellSer: serializer.CellSerializerEx = new serializer.CellSerializerEx();
        public cellDeSer: serializer.CellDeserializerEx = new serializer.CellDeserializerEx();
        public cellsDeSer: serializer.CellsDeserializerEx = new serializer.CellsDeserializerEx(this.cellDeSer);
    }

    const i: Singleton = new Singleton();

    // ---------------------------------------------------------------------------------------------------------------

    export class StarterEx implements Starter {

        private readonly _logger: logger.Logger = new logger.LoggerEx(StarterEx);
        private readonly _ws: Ws;

        public constructor(ws: Ws) {
            this._ws = ws;
        }

        public init(): void {
            logger.LoggerEx.cLevel =
                DEBUG
                    ? logger.Level.TRACE
                    : logger.Level.WARN;

            i.langFinder.cSupported = [
                new i18n.LangTagEx("pl", "pl"),
                new i18n.LangTagEx("en", "us"),
            ];

            i.translator.cPath = (langTag) => "i18n/{0}.json".format(langTag.lang);

            i.translator.init(() => {
                this._logger.error("i.translator.init error");

            }, () => {
                i.title.setFixed(i.title.cStandardTitle);

                i.ui.initFlags((langTag) => {
                    i.langSetter.setLang(langTag);
                    i.translator.init(
                        () => this._logger.error("lang.change fail={0}", langTag),
                        () => this._logger.debug("lang.change ok={0}", langTag),
                    );
                });

                i.grids.init();

                ("WebSocket" in window)
                    ? this._ws.init()
                    : i.message.setFixed(i18n.tk("ws.unable"));
            });
        }
    }

    // ---------------------------------------------------------------------------------------------------------------

    export class WsEx implements Ws {

        private _ws: WebSocket;
        private readonly _onEvent: OnEvent;

        public constructor(onEvent: OnEvent) {
            this._onEvent = onEvent;
        }

        public init(): void {
            const protocol: string = location.protocol === "https:" ? "wss:" : "ws:";
            this._ws = new WebSocket(protocol + "//" + API_WS_URL + "/ws");
            this._ws.onopen = (ev: Event) => this._onEvent.onOpen(ev);
            this._ws.onmessage = (ev: MessageEvent) => this._onEvent.onMessage(ev);
            this._ws.onclose = (ev: CloseEvent) => this._onEvent.onClose(ev);
            this._ws.onerror = (ev: Event) => this._onEvent.onError(ev);
        }

        public send(msg: string): void {
            this._ws.send(msg);
            this._onEvent.onSend(msg);
        }
    }

    // ---------------------------------------------------------------------------------------------------------------

    export class OnEventEx implements OnEvent {

        private readonly _logger: logger.Logger = new logger.LoggerEx(OnEventEx);

        // https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
        private readonly _closeReason: Map<number, string> =
            new Map<number, string>([
                [1000, "CLOSE_NORMAL"],
                [1001, "CLOSE_GOING_AWAY"],
                [1002, "CLOSE_PROTOCOL_ERROR"],
                [1003, "CLOSE_UNSUPPORTED"],
                [1005, "CLOSE_NO_STATUS"],
                [1004, "?"],
                [1006, "CLOSE_ABNORMAL"],
                [1007, "Unsupported Data"],
                [1008, "Policy Violation"],
                [1009, "CLOSE_TOO_LARGE"],
                [1010, "Missing Extension"],
                [1011, "Internal Error"],
                [1012, "Service Restart"],
                [1013, "Try Again Later"],
                [1014, "?"],
                [1015, "TLS Handshake"],
            ]);

        private _ws: Ws;
        private readonly _onMessage: OnMessage;

        public constructor(onMessage: OnMessage) {
            this._onMessage = onMessage;
        }

        public setWs(ws: Ws): void {
            this._ws = ws;
        }

        public onOpen(ev: Event): void {
            this._logger.debug("url={0}", ev.target.url);
            const id: string = i.url.param("id").value || "NEW";
            this._ws.send("GAME {0}".format(id));
        }

        public onMessage(ev: MessageEvent): void {
            this._logger.debug("data={0}", ev.data);
            this._onMessage.process(MessageEx.Ex(ev));
        }

        public onSend(ev: string): void {
            this._logger.debug("send={0}", ev);
        }

        public onClose(ev: CloseEvent): void {
            const reason: string = ev.reason || this._closeReason.get(ev.code) || "?";
            this._logger.debug("close={0}({1})", ev.code, reason);

            i.message.setFixed(
                i18n.tk("ws.close", [ev.code, reason]),
                strings._.message.clazz.fail,
            );
            i.title.setFixed(
                i.title.cStandardTitle
            );

            i.selection.deactivate();
        }

        public onError(ev: Event): void {
            this._logger.debug("close={0}", ev.type);

            i.message.setFixed(
                i18n.tk("ws.error", [ev.type]),
                strings._.message.clazz.fail,
            );
            i.title.setFixed(
                i.title.cStandardTitle
            );

            i.selection.deactivate();
        }
    }

    // ---------------------------------------------------------------------------------------------------------------

    export class MessageEx implements Message {

        public readonly raw: string;
        public readonly command: string;
        public readonly payload: string;

        public constructor(raw: string, command: string, payload: string) {
            this.raw = raw;
            this.command = command;
            this.payload = payload;
        }

        public static Ex(ev: MessageEvent): MessageEx {
            const raw: string = ev.data;
            const command: string = raw.substring(0, raw.indexOf(" ")) || raw;
            const payload: string = raw.substring(command.length + 1);

            return new MessageEx(raw, command, payload);
        }

        public static Sub(command: string, payload: string, subCommand: string): MessageEx {
            return new MessageEx(
                "{0} {1}".format(command, payload),
                "{0} {1}".format(command, subCommand),
                payload.substring(subCommand.length + 1)
            );
        }

        public toString(): string {
            return "MessageEx[raw={0} command={1} payload={2}]".format(this.raw, this.command, this.payload);
        }
    }

    // ---------------------------------------------------------------------------------------------------------------

    export class OnMessageEx implements OnMessage {

        private readonly _logger: logger.Logger = new logger.LoggerEx(OnMessageEx);

        private _ws: Ws;
        private readonly _func: Map<string, Callback<string>>;

        public setWs(ws: Ws): void {
            this._ws = ws;
        }

        // tslint:disable:max-func-body-length // map of func
        public constructor() {

            this._func = new Map<string, Callback<string>>([
                ["HI_.", payload => {
                    i.message.addFleeting(
                        i18n.tk("pre.hi", payload),
                        i.timeout.fast
                    );
                }],

                ["GAME", payload => {
                    if (payload.startsWith("OK")) {
                        this.process(
                            MessageEx.Sub("GAME", payload, "OK")
                        );

                    } else if (payload.startsWith("FAIL")) {
                        this.process(
                            MessageEx.Sub("GAME", payload, "FAIL")
                        );

                    } else {
                        this._logger.error("unknown_func={0},{1}", "GAME", payload);
                    }
                }],

                ["GAME OK", payload => {
                    i.grids.$opponent.addClass(strings._.grid.clazz.inactive);
                    i.grids.$shoot.removeClass(strings._.grid.clazz.inactive);

                    if (payload) {
                        const $gameUrl: JQuery = $(strings._.info.id_game_url);

                        i.translator.unsetTr($gameUrl);
                        $gameUrl.text(i.url.url(
                            i.url.param("v"),
                            i.url.param("m"),
                            i.url.param("d"),
                            new url.UrlParamEx("id", payload),
                        ));

                        $(strings._.info.id_players_game).text(1);
                    }

                    i.grids.reset();

                    i.message.setFixed(
                        i18n.tk("put.info")
                    );
                    i.message.addFixedLink(
                        i18n.tk("put.done"),
                        strings._.message.ok.id_ship_selection
                    );

                    i.selection.activate();
                    i.event1.on($(strings._.message.ok.id_ship_selection), "click",
                        () => this._ws.send("GRID {0}".format(i.selection.collect()))
                    );
                }],

                ["GAME FAIL", payload => {
                    i.message.setFixed(
                        i18n.tk("fail.fail", payload)
                    );
                }],

                ["GRID", payload => {
                    if (payload.startsWith("OK")) {
                        this.process(
                            MessageEx.Sub("GRID", payload, "OK")
                        );

                    } else if (payload.startsWith("FAIL")) {
                        this.process(
                            MessageEx.Sub("GRID", payload, "FAIL")
                        );

                    } else {
                        this._logger.error("unknown_func={0},{1}", "GRID", payload);
                    }
                }],

                ["GRID OK", payload => {
                    i.grids.$opponent.removeClass(strings._.grid.clazz.inactive);
                    i.grids.$shoot.addClass(strings._.grid.clazz.inactive);

                    i.message.setFixed(
                        i18n.tk("tour.awaiting")
                    );

                    i.selection.deactivate();
                    i.selection.move();
                }],

                ["GRID FAIL", payload => {
                    i.message.addFleeting(
                        i18n.tk("put.fail"),
                        i.timeout.default_,
                        strings._.message.clazz.fail
                    );
                }],

                ["TOUR", payload => {
                    if (payload.startsWith("START")) {
                        this.process(
                            MessageEx.Sub("TOUR", payload, "START")
                        );

                    } else if (payload.startsWith("YOU")) {
                        this.process(
                            MessageEx.Sub("TOUR", payload, "YOU")
                        );

                    } else if (payload.startsWith("HE")) {
                        this.process(
                            MessageEx.Sub("TOUR", payload, "HE")
                        );

                    } else {
                        this._logger.error("unknown_func={0},{1}", "TOUR", payload);
                    }
                }],

                ["TOUR START", payload => {
                    // none here
                }],

                ["TOUR YOU", payload => {
                    i.grids.$shoot.removeClass(strings._.grid.clazz.inactive);

                    i.message.setFixed(
                        i18n.tk("tour.shoot_me"),
                        strings._.message.clazz.important
                    );
                    i.title.setBlinking(
                        i18n.tk("title.shoot_me"),
                        false
                    );

                    const $cells: JQuery = i.grids.$shootCells;

                    $cells.addClass(strings._.cell.clazz.shootable);
                    i.event1.onetime($cells, "click", $td => {
                        const pos: string = i.cellSer.convert(
                            grid.CellEx.FromElement($td)
                        );

                        this._ws.send("SHOT {0}".format(pos));
                    });
                }],

                ["TOUR HE", payload => {
                    i.grids.$shoot.addClass(strings._.grid.clazz.inactive);
                    i.grids.$shootCells.removeClass(strings._.cell.clazz.shootable);

                    i.message.setFixed(
                        i18n.tk("tour.shoot_opp")
                    );
                    i.title.setFixed(
                        i18n.tk("title.shoot_opp")
                    );
                }],

                ["YOU_", payload => {
                    const cells: grid.Cell[] = i.cellsDeSer.convert(payload);

                    const clazzMap: Map<string, string> = new Map([
                        ["ship", strings._.cell.clazz.ship],
                        ["empty", strings._.cell.clazz.empty],
                    ]);

                    cells.forEach((cell) => {
                        i.grids.setCellClass(
                            i.grids.$shoot, cell,
                            clazzMap.get(cell.clazz!) || "", false
                        );
                    });
                }],

                ["HE__", payload => {
                    const cells: grid.Cell[] = i.cellsDeSer.convert(payload);

                    cells.forEach((cell) => {
                        i.grids.setCellClass(
                            i.grids.$opponent, cell,
                            strings._.cell.clazz.opp_shoot, true
                        );
                    });
                }],

                ["WON_", payload => {
                    i.grids.$opponent.addClass(strings._.grid.clazz.inactive);
                    i.grids.$shoot.addClass(strings._.grid.clazz.inactive);

                    const winning: JQuery = payload === "YOU"
                        ? $(strings._.info.id_winning_me)
                        : $(strings._.info.id_winning_opp);
                    winning.text(Number.parseInt(winning.text()) + 1);

                    payload === "YOU"
                        ? i.message.setFixed(i18n.tk("end.won_me"))
                        : i.message.setFixed(i18n.tk("end.won_opp"));

                    i.message.addFixedLink(
                        i18n.tk("end.next_game"),
                        strings._.message.ok.id_game_next
                    );
                    i.event1.onetime($(strings._.message.ok.id_game_next), "click", () =>
                        this.process(new MessageEx("", "GAME OK", ""))
                    );

                    i.title.setFixed(
                        i18n.tk("title.standard")
                    );
                }],

                ["1PLA", payload => {
                    $(strings._.info.id_players_game).text(1);

                    const interrupted: boolean = payload === "game-interrupted";

                    (interrupted)
                        ? i.message.setFixed(i18n.tk("end.opp_gone"))
                        : i.message.addFleeting(i18n.tk("end.opp_gone"), i.timeout.slow);

                    if (interrupted) {
                        i.grids.$shootCells.removeClass(strings._.cell.clazz.shootable);
                        i.event1.off(i.grids.$shootCells, "click"); // remove shoot action

                        i.message.addFixedLink(
                            i18n.tk("end.next_game"),
                            strings._.message.ok.id_game_next
                        );

                        i.grids.$opponent.addClass(strings._.grid.clazz.inactive);
                        i.grids.$shoot.addClass(strings._.grid.clazz.inactive);

                        i.title.setFixed(
                            i.title.cStandardTitle
                        );
                    }

                    i.event1.onetime($(strings._.message.ok.id_game_next), "click", () =>
                        this.process(new MessageEx("", "GAME OK", ""))
                    );
                }],

                ["2PLA", payload => {
                    $(strings._.info.id_players_game).text(2);

                    i.message.addFleeting(
                        i18n.tk("tour.two_players"),
                        i.timeout.slow,
                    );
                }],

                ["PONG", payload => {
                    // none here
                }],

                ["STAT", payload => {
                    const infoStat: any = {
                        ["players"]: strings._.info.id_players_global,
                    };

                    const stats: string[] = payload.split(",");

                    stats.forEach((stat) => {
                        const [key, value]: string[] = stat.split("=");
                        const $infoStatKey: JQuery = $(infoStat[key]);

                        $infoStatKey.text(value);
                        i.translator.unsetTr($infoStatKey);
                    });
                }],

                ["400_", payload => {
                    i.message.setFixed(
                        i18n.tk("fail.fail", payload),
                    );

                    this._logger.error("400_={0}", payload);
                }],
            ]);

            // -------------------------------------------------------------------------------
        }

        public process(msg: Message): void {
            const callback: Callback<string> | undefined
                = this._func.get(msg.command);

            if (callback !== undefined) {
                callback(msg.payload);
            } else {
                this._logger.error("unknown={0}", msg);
            }
        }

    }

    // ---------------------------------------------------------------------------------------------------------------

    class SingletonGame {

        private _onMessage: OnMessageEx = new OnMessageEx();
        private _onEvent: OnEventEx = new OnEventEx(this._onMessage);
        private _ws: WsEx = new WsEx(this._onEvent);
        public starter: StarterEx = new StarterEx(this._ws);

        public constructor() {
            this._onMessage.setWs(this._ws);
            this._onEvent.setWs(this._ws);
        }
    }

    export let iGame: SingletonGame = new SingletonGame();
}
