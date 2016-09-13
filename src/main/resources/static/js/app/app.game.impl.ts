/// <reference path="string.format.ts" />
/// <reference path="url.decl.ts" />
/// <reference path="url.impl.ts" />
/// <reference path="random.decl.ts" />
/// <reference path="random.impl.ts" />
/// <reference path="event0.decl.ts" />
/// <reference path="event0.impl.ts" />
/// <reference path="event1.decl.ts" />
/// <reference path="event1.impl.ts" />
/// <reference path="logger.decl.ts" />
/// <reference path="logger.impl.ts" />
/// <reference path="i18n.decl.ts" />
/// <reference path="i18n.impl.ts" />
/// <reference path="title.decl.ts" />
/// <reference path="title.impl.ts" />
/// <reference path="grid.decl.ts" />
/// <reference path="grid.impl.ts" />
/// <reference path="serializer.decl.ts" />
/// <reference path="serializer.impl.ts" />
/// <reference path="message.decl.ts" />
/// <reference path="message.impl.ts" />
/// <reference path="flags.decl.ts" />
/// <reference path="flags.impl.ts" />
/// <reference path="app.game.decl.ts" />

// extend EventTarget; url is given in event on WebSocket open
interface EventTarget {
    readonly url: string;
}

namespace game {
    "use strict";

    export class StarterEx implements Starter {

        public init(): void {
            // config
            logger.conf.level = logger.Level.TRACE;

            i18n.conf.supported = [
                new i18n.LangTagEx("pl", "pl"),
                new i18n.LangTagEx("en", "us"),
            ];

            i18n.conf.path = (lt) => "i18n/{0}.json".format(lt.lang);

            // main, something, start game
            i18n.i.translator.init(() => {
                    logger.i.debug([app, "init"], "translator init error");

                }, () => {
                    title.i.fixed(new i18n.TrKeyEx("title.standard"));

                    flags.i.init((lang) => {
                        i18n.i.setter.setLang(lang);
                        i18n.i.translator.init();
                    });

                    grid.i.grids.init();

                    if (!("WebSocket" in window)) {
                        message.i.m.fixed(new i18n.TrKeyEx("ws.unable"));
                        return;
                    }

                    game.i.ws.init();

                }
            );
        }
    }

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

    export class OnEventEx implements OnEvent {

        private _ws: Ws;
        private _logger: Logger;
        private _url: Url;

        public onOpen(ev: Event): void {
            this._logger.info([], "ws.onopen   : " + ev.target.url);
            const id: string = this._url.param("id") || "NEW";
            this._ws.send("GAME " + id);
        }

        public    onMessage(ev: MessageEvent): void {
        }

        public onSend(ev: string): void {
        }

        public  onClose(ev: CloseEvent): void {
        }

        public   onError(ev: Event): void {
        }


    }

    export class MessageEx implements Message {
        public readonly raw: string;
        public readonly command: string;
        public readonly payload: string;
    }

    export class OnMessageEx implements OnMessage {
        public process(msg: game.Message): void {
        }

    }

    // ---------------------------------------------------------------------------------------------------------------

    class Singleton {
        public url = new url.UrlEx();

        public starter: Starter = new StarterEx();
        public ws: Ws = new WsEx(this.onEvent);
        public onEvent: OnEvent = new OnEventEx();
        public onMessage: OnMessage = new OnMessageEx();
    }

    export const i: Singleton = new Singleton();
}
