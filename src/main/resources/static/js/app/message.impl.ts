/// <reference path="message.decl.ts" />
/// <reference path="random.impl.ts" />
/// <reference path="i18n.impl.ts" />

namespace message {
    "use strict";

    export class TimeoutEx implements Timeout {

        public readonly fast: number = 1500;
        public readonly default_: number = 2500;
        public readonly slow: number = 5000;
    }

    export class MessageEx implements Message {

        private readonly _translator: i18n.Translator;
        private readonly _msgDiv: JQuery = $("#message");

        public constructor(translator: i18n.Translator) {
            this._translator = translator;
        }

        private set_(key: i18n.TrKey, clazz: string, timeout?: number): void {
            const outerId: string =
                timeout
                    ? "#{0}".format(random.i.str(7, "a"))
                    : "#msg-const";

            // tslint:disable:object-literal-key-quotes
            const $outer: JQuery = $("<span/>", {
                "id": outerId,
                "class": "{0} msg".format(clazz),
            });

            const $inner: JQuery = $("<span/>");
            this._translator.setTr($inner, key);
            $outer.append($inner);

            if (timeout) {
                this._msgDiv.append($outer);
                setTimeout(
                    () => $(outerId).fadeOut("fast",
                        () => $(outerId).remove()
                    ), timeout);

            } else {
                $("#msg-const").remove();
                this._msgDiv.append($outer);
            }
        }

        public fixed(key: i18n.TrKey, clazz: string): void {
            this.set_(key, clazz);
        }

        public fleeting(key: i18n.TrKey, clazz: string, timeout: number): void {
            this.set_(key, clazz, timeout);
        }

        public appendFixedLink(key: i18n.TrKey, id: string): void {
            // tslint:disable:object-literal-key-quotes
            const $a: JQuery = $("<a/>", {
                "href": "#",
                "id": id,
            });

            this._translator.setTr($a, key);

            $("#msg-const").append($a);
        }
    }

    // ---------------------------------------------------------------------------------------------------------------

    class Singleton {
        public timeout: Timeout = new TimeoutEx();
        public m: Message = new MessageEx(i18n.i.translator);
    }

    export const i: Singleton = new Singleton();
}
