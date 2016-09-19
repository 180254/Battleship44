/// <reference path="app.game.decl.ts" />
/// <reference path="assert.impl.ts" />
/// <reference path="event0.impl.ts" />
/// <reference path="event1.impl.ts" />
/// <reference path="format.impl.ts" />
/// <reference path="grid.impl.ts" />
/// <reference path="i18n.impl.ts" />
/// <reference path="logger.impl.ts" />
/// <reference path="message.impl.ts" />
/// <reference path="random.impl.ts" />
/// <reference path="serializer.impl.ts" />
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

        public starter: Starter = new StarterEx(this._ws);
        private _ws: Ws = new WsEx(this._onEvent);
        private _onEvent: OnEvent = new OnEventEx();
        private _onMessage: OnMessage = new OnMessageEx();

        public assert: assert.AssertEx = new assert.AssertEx();
        public event1: event1.EventEx = new event1.EventEx(this.random);
        public random: random.RandomEx = new random.RandomEx();
        public url: url.UrlEx = new url.UrlEx();

        public grids: grid.GridsEx = new grid.GridsEx();
        public selection: grid.SelectionEx = new grid.SelectionEx(this.grids);

        public langComparison: i18n.LangTagComparisonEx = new i18n.LangTagComparisonEx();
        public langFinder: i18n.LangFinderEx = new i18n.LangFinderEx();
        public langSelector: i18n.LangSelectorEx = new i18n.LangSelectorEx(this.langFinder, this.langComparison);
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

        private _logger: logger.Logger = new logger.LoggerEx(StarterEx);
        private _ws: Ws;

        public constructor(ws: game.Ws) {
            this._ws = ws;
        }

        public init(): void {
            // config
            logger.cLevel = logger.Level.TRACE;

            i.langFinder.cSupported = [
                new i18n.LangTagEx("pl", "pl"),
                new i18n.LangTagEx("en", "us"),
            ];

            i.translator.cPath = (lt) => "i18n/{0}.json".format(lt.lang);

            // main, something, start game
            i.translator.init(() => {
                this._logger.debug("translator init error");

                }, () => {
                i.title.fixed(new i18n.TrKeyEx("title.standard"));

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
                }
            );
        }
    }

    // ---------------------------------------------------------------------------------------------------------------

    export class WsEx implements Ws {
        private _ws: WebSocket;
        private _onEvent: OnEvent;

        constructor(onEvent: OnEvent) {
            this._onEvent = onEvent;
        }

        public init(): void {
            this._ws = new WebSocket("ws://" + window.location.host + "/ws");
            this._ws.onopen = this._onEvent.onOpen;
            this._ws.onmessage = this._onEvent.onMessage;
            this._ws.onclose = this._onEvent.onClose;
            this._ws.onerror = this._onEvent.onError;
        }

        public send(msg: string): void {
            this._ws.send(msg);
            this._onEvent.onSend(msg);
        }
    }

    // ---------------------------------------------------------------------------------------------------------------

    export class OnEventEx implements OnEvent {

        private _logger: logger.Logger = new logger.LoggerEx(OnEventEx);
        private _ws: Ws;

        public onOpen(ev: Event): void {
            this._logger.info("ws.onopen   : " + ev.target.url);
            const id: string = i.url.param("id") || "NEW";
            this._ws.send("GAME " + id);
        }

        public    onMessage(ev: MessageEvent): void {
            //
        }

        public onSend(ev: string): void {
            //
        }

        public  onClose(ev: CloseEvent): void {
            //
        }

        public   onError(ev: Event): void {
            //
        }
    }

    // ---------------------------------------------------------------------------------------------------------------

    export class MessageEx implements Message {
        public readonly raw: string;
        public readonly command: string;
        public readonly payload: string;
    }

    // ---------------------------------------------------------------------------------------------------------------

    export class OnMessageEx implements OnMessage {
        public process(msg: game.Message): void {
            //
        }

    }
}
