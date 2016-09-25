/// <reference types="jquery" />
/// <reference types="jqueryui" />
/// <reference types="js-cookie" />
/// <reference path="app.game.decl.ts" />
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
/// <reference path="ui.impl.ts" />
/// <reference path="url.impl.ts" />

// extend EventTarget; url is given in event on WebSocket open
interface EventTarget {
    readonly url: string;
}

namespace game {
    "use strict";

    class Singleton {

        public assert: assert.AssertEx = new assert.AssertEx();
        public event1: event1.EventEx = new event1.EventEx(this.random);
        public random: random.RandomEx = new random.RandomEx();
        public url: url.UrlEx = new url.UrlEx();

        public grids: grid.GridsEx = new grid.GridsEx();
        public selection: grid.SelectionEx = new grid.SelectionEx(this.grids);

        public langComp: i18n.LangTagComparisonEx = new i18n.LangTagComparisonEx();
        public langFinder: i18n.LangFinderEx = new i18n.LangFinderEx();
        public langSelector: i18n.LangSelectorEx = new i18n.LangSelectorEx(this.langFinder, this.langComp);
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

    export let i: Singleton = new Singleton();

    // ---------------------------------------------------------------------------------------------------------------

    export class StarterEx implements Starter {

        private readonly _logger: logger.Logger = new logger.LoggerEx(StarterEx);
        private readonly _ws: Ws;

        public constructor(ws: game.Ws) {
            this._ws = ws;
        }

        public init(): void {
            logger.cLevel = logger.Level.TRACE;

            i.langFinder.cSupported = [
                new i18n.LangTagEx("pl", "pl"),
                new i18n.LangTagEx("en", "us"),
            ];

            i.translator.cPath = (lt) => "i18n/{0}.json".format(lt.lang);

            // main, something, start game
            i.translator.init(() => {
                this._logger.error("translator init error");

            }, () => {
                i.title.fixed(i.title.cStandardTitle);

                i.ui.initFlags((lang) => {
                    i.langSetter.setLang(lang);
                    i.translator.init();
                });

                i.grids.init();

                if (!("WebSocket" in window)) {
                    i.message.fixed(new i18n.TrKeyEx("ws.unable"));
                    return;
                }

                this._ws.init();
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
            this._ws = new WebSocket("ws://" + window.location.host + "/ws");
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

        private _ws: Ws;
        private readonly _onMessage: OnMessage;

        public constructor(onMessage: game.OnMessage) {
            this._onMessage = onMessage;
        }

        public setWs(ws: Ws): void {
            this._ws = ws;
        }

        public onOpen(ev: Event): void {
            this._logger.debug("ws.onopen   : {0}", ev.target.url);
            const id: string = i.url.param("id").value || "NEW";
            this._ws.send("GAME {0}".format(id));
        }

        public onMessage(ev: MessageEvent): void {
            this._logger.debug("ws.onmessage: {0}", ev.data);
            this._onMessage.process(MessageEx.EX(ev));
        }

        public onSend(ev: string): void {
            this._logger.debug("ws.send     : {0}", ev);
        }

        public onClose(ev: CloseEvent): void {
            const reason: string = ev.reason || this._wsCode(ev.code) || "?";
            this._logger.debug("ws.onclose  : {0}({1})", ev.code, reason);

            i.message.fixed(
                new i18n.TrKeyEx("ws.close", [ev.code, reason]),
                "msg-fail"
            );

            i.title.fixed(i.title.cStandardTitle);
            i.selection.deactivate();
        }

        public onError(ev: Event): void {
            this._logger.debug("ws.onclose  : {0}", ev.type);

            i.message.fixed(
                new i18n.TrKeyEx("ws.error", [ev.type]),
                "msg-fail"
            );

            i.title.fixed(i.title.cStandardTitle);
            i.selection.deactivate();
        }

        // noinspection JSMethodCanBeStatic
        private _wsCode(exitCode: number): string {
            // https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
            return <string> ((<any> {
                1000: "CLOSE_NORMAL",
                1001: "CLOSE_GOING_AWAY",
                1002: "CLOSE_PROTOCOL_ERROR",
                1003: "CLOSE_UNSUPPORTED",
                1005: "CLOSE_NO_STATUS",
                1004: "?",
                1006: "CLOSE_ABNORMAL",
                1007: "Unsupported Data",
                1008: "Policy Violation",
                1009: "CLOSE_TOO_LARGE",
                1010: "Missing Extension",
                1011: "Internal Error",
                1012: "Service Restart",
                1013: "Try Again Later",
                1014: "?",
                1015: "TLS Handshake",
            })[exitCode]);
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

        public static EX(ev: MessageEvent): MessageEx {
            const raw: string = ev.data;
            const command: string = raw.substring(0, raw.indexOf(" ")) || raw;
            const payload: string = raw.substring(command.length + 1);

            return new MessageEx(raw, command, payload);
        }
    }

    // ---------------------------------------------------------------------------------------------------------------

    type Callback<T> = (value: T) => void;

    export class OnMessageEx implements OnMessage {

        private _ws: Ws;
        private readonly _func: Map<string, Callback<string>>;

        public setWs(ws: Ws): void {
            this._ws = ws;
        }

        // tslint:disable:max-func-body-length
        public constructor() {

            this._func = new Map<string, Callback<string>>([
                ["HI_.", payload => {
                    // TODO: factory method, i18n.k()?
                    i.message.fleeting(new i18n.TrKeyEx("pre.hi", payload), i.timeout.fast);
                }],

                ["GAME OK", payload => {
                    i.grids.$opponent.addClass("inactive");
                    i.grids.$shoot.removeClass("inactive");

                    if (payload) {
                        const $infoGameUrl: JQuery = $("#info-game-url");
                        i.translator.unsetTr($infoGameUrl);
                        $infoGameUrl.text(i.url.url(
                            i.url.param("v"),
                            new url.UrlParamEx("id", payload),
                        ));

                        $("#info-players-game").text(1);
                    }

                    i.grids.reset();
                    i.message.fixed(new i18n.TrKeyEx("put.info"));
                    i.message.appendFixedLink(new i18n.TrKeyEx("put.done"), "ok-ship-selection");

                    i.selection.activate();
                    i.event1.on($("#ok-ship-selection"), "click",
                        () => this._ws.send("GRID {0}".format(i.selection.collect())));
                }],

                ["GAME FAIL", payload => {
                    i.message.fixed(new i18n.TrKeyEx("fail.fail", payload));
                }],

                ["GRID OK", payload => {
                    i.grids.$opponent.removeClass("inactive");
                    i.grids.$shoot.addClass("inactive");

                    i.message.fixed(new i18n.TrKeyEx("tour.awaiting"));

                    i.selection.deactivate();
                    i.selection.move();
                }],

                ["GRID FAIL", payload => {
                    i.message.fleeting(new i18n.TrKeyEx("put.fail"), i.timeout.default_, "msg-fail");
                }],

                ["TOUR START", payload => {
                    // none here
                }],

                ["TOUR YOU", payload => {
                    i.grids.$shoot.removeClass("inactive");

                    i.message.fixed(new i18n.TrKeyEx("tour.shoot_me"), "msg-important");
                    i.title.blinking(new i18n.TrKeyEx("title.shoot_me"), false);

                    i.grids.$shoot.find("td").addClass("shoot-able");
                    i.event1.onetime(i.grids.$shoot.find("td"), "click", $td => {
                        const pos: string = i.cellSer.convert(
                            // TODO: create CellEx static constructor from JQuery td
                            new grid.CellEx(
                                Number.parseInt($td.attr("data-row-i")), Number.parseInt($td.attr("data-col-i"))
                            )
                        );

                        this._ws.send("SHOOT {0}".format(pos));
                    });
                }],

                ["TOUR HE", payload => {
                    i.grids.$shoot.addClass("inactive");
                    i.grids.$shoot.find("td").removeClass("shoot-able");

                    i.message.fixed(new i18n.TrKeyEx("tour.shoot_opp"));
                    i.title.fixed(new i18n.TrKeyEx("title.shoot_opp"));
                }],

                ["YOU_", payload => {
                    const cells: grid.Cell[] = i.cellsDeSer.convert(payload);

                    cells.forEach((cell) => {
                        // TODO: fix class?
                        i.grids.setCellClass(i.grids.$shoot, cell, cell.clazz!, false);
                    });
                }],

                ["HE__", payload => {
                    const cells: grid.Cell[] = i.cellsDeSer.convert(payload);

                    cells.forEach((cell) => {
                        i.grids.setCellClass(i.grids.$opponent, cell, "opponent-shoot", false);
                    });
                }],

                ["WON_", payload => {
                    i.grids.$opponent.addClass("inactive");
                    i.grids.$shoot.addClass("inactive");

                    const winning: JQuery = payload === "YOU" ? $("#info-winning-me") : $("#info-winning-opp");
                    winning.text(Number.parseInt(winning.text()) + 1);

                    payload === "YOU"
                        ? i.message.fixed(new i18n.TrKeyEx("end.won_me"))
                        : i.message.fixed(new i18n.TrKeyEx("end.won_opp"));

                    i.message.appendFixedLink(new i18n.TrKeyEx("end.next_game"), "ok-game-next");

                    i.event1.onetime($("#ok-game-next"), "click", () =>
                        (this._func.get("GAME OK"))!("")
                    );

                    i.title.fixed(new i18n.TrKeyEx("title.standard"));
                }],

                ["1PLA", payload => {
                    $("#info-players-game").text(1);
                    const gameInterrupted: boolean = payload === "game-interrupted";

                    if (gameInterrupted) {
                        i.message.fixed(new i18n.TrKeyEx("end.opp_gone"));
                    } else {
                        i.message.fleeting(new i18n.TrKeyEx("end.opp_gone"), i.timeout.slow);
                    }

                    if (gameInterrupted) {
                        i.grids.$shoot.find("td").removeClass("shoot-able");
                        i.event1.off(i.grids.$shoot.find("td"), "click"); // remove shoot action

                        i.message.appendFixedLink(new i18n.TrKeyEx("end.next_game"), "ok-game-next");

                        i.grids.$opponent.addClass("inactive");
                        i.grids.$shoot.addClass("inactive");

                        i.title.fixed(i.title.cStandardTitle);
                    }

                    i.event1.onetime($("#ok-game-next"), "click", () =>
                        (this._func.get("GAME OK"))!("")
                    );
                }],

                ["2PLA", payload => {
                    $("#info-players-game").text(2);
                    i.message.fleeting(new i18n.TrKeyEx("tour.two_players"), i.timeout.slow);
                }],

                ["PONG", payload => {
                    // none here
                }],

                ["STAT", payload => {
                    // TODO: specify type
                    const infoStat: any = {
                        players: "#info-players-global",
                    };

                    const stats: string[] = payload.split(",");

                    for (let k: number = 0; k < stats.length; k = k + 1) {
                        const stat: string[] = stats[k].split("=");
                        $(infoStat[stat[0]]).text(stat[1]);
                        i.translator.unsetTr($(infoStat[stat[0]]));
                    }
                }],

                ["400_", payload => {
                    i.message.fixed(new i18n.TrKeyEx("fail.fail"), payload);
                }],
            ]);

            // -------------------------------------------------------------------------------
        }

        public process(msg: game.Message): void {
            // TODO: anti pattern? use map key feature (get)
            for (const [funcName, func] of this._func) {
                if (msg.raw.lastIndexOf(funcName, 0) === 0) {

                    return func(
                        msg.raw.substring(funcName.length + 1)
                    );
                }
            }
        }

    }

    // ---------------------------------------------------------------------------------------------------------------

    class SingletonGame {

        private _onMessage: OnMessageEx = new game.OnMessageEx();
        private _onEvent: OnEventEx = new game.OnEventEx(this._onMessage);
        private _ws: WsEx = new game.WsEx(this._onEvent);
        public starter: StarterEx = new game.StarterEx(this._ws);

        public constructor() {
            this._onEvent.setWs(this._ws);
            this._onMessage.setWs(this._ws);
        }
    }

    export let iGame: SingletonGame = new SingletonGame();
}
