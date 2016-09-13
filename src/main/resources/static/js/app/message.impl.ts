/// <reference path="message.decl.ts" />
/// <reference path="random.impl.ts" />
/// <reference path="i18n.impl.ts" />

namespace message {
    "use strict";

    class Conf {
        public msgDivId: string = "#message";
        public msgConstId: string = "#msg-const";
    }

    export const conf: Conf = new Conf();

    // ---------------------------------------------------------------------------------------------------------------

    export class TimeoutEx implements Timeout {

        public readonly fast: number = 1500;
        public readonly default_: number = 2500;
        public readonly slow: number = 5000;
    }

    export class MessageEx implements Message {

        private readonly _translator: i18n.Translator;

        public constructor(translator: i18n.Translator) {
            this._translator = translator;
        }

        private set_(key: i18n.Key, clazz: string, timeout?: number): void {
            const id: string = timeout
                ? "#{0}".format(random.i.str(7, "a"))
                : conf.msgConstId;

            // tslint:disable:object-literal-key-quotes
            const $outer: JQuery = $("<span/>", {
                "id": id,
                "class": "{0} msg".format(clazz),
            });

            const $inner: JQuery = $("<span/>");
            this._translator.setTr($inner, key);
            $outer.append($inner);

            if (timeout) {
                setTimeout(
                    () => $(id).fadeOut("fast",
                        () => $(id).remove()
                    ), timeout);

            } else {
                $(conf.msgConstId).remove();
            }

            // TODO: race condition
            $(conf.msgDivId).append($outer);
        }

        public fixed(key: i18n.Key, clazz: string): void {
            this.set_(key, clazz);
        }

        public appendLink(key: i18n.Key, id: string): void {
            // tslint:disable:object-literal-key-quotes
            const $a: JQuery = $("<a/>", {
                "href": "#",
                "id": id,
            });

            this._translator.setTr($a, key);

            $(conf.msgConstId).append($a);
        }

        public fleeting(key: i18n.Key, clazz: string, timeout: number): void {
            this.set_(key, clazz, timeout);
        }
    }

    // ---------------------------------------------------------------------------------------------------------------

    export let i: Message = new MessageEx(i18n.i.translator);
}
