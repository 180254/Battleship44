/// <reference path="message.decl.ts" />
/// <reference path="random.decl.ts" />
/// <reference path="i18n.decl.ts" />
/// <reference path="format.decl.ts" />

namespace message {
    "use strict";

    export class TimeoutEx implements Timeout {

        public readonly fast: number = 1500;
        public readonly default_: number = 2500;
        public readonly slow: number = 5000;
    }

    // ---------------------------------------------------------------------------------------------------------------

    export class MessageEx implements Message {

        public $cMsgDiv: JQuery = $("#message");

        private readonly _random: random.Random;
        private readonly _translator: i18n.Translator;

        public $cConstDiv: () => string = () => "#msg-const";

        public constructor(random: random.Random,
                           translator: i18n.Translator) {
            this._random = random;
            this._translator = translator;
        }

        public fixed(trKey: i18n.TrKey, clazz?: string): void {
            this._set(trKey, undefined, clazz);
        }

        public fleeting(trKey: i18n.TrKey, timeout: number, clazz?: string): void {
            this._set(trKey, timeout, clazz);
        }

        public appendFixedLink(trKey: i18n.TrKey, id: string, clazz?: string): void {
            // tslint:disable:object-literal-key-quotes
            const $a: JQuery = $("<a/>", {
                "href": "#",
                "id": id,
                "class": clazz || "",
            });

            this._translator.setTr($a, trKey);
            $(this.$cConstDiv()).append($a);
        }

        private _set(key: i18n.TrKey, timeout?: number, clazz?: string): void {
            const outerId: string =
                timeout
                    ? "#{0}".format(this._random.str(7, "a"))
                    : this.$cConstDiv();

            // tslint:disable:object-literal-key-quotes
            const $outer: JQuery = $("<span/>", {
                "id": outerId,
                "class": "{0} msg".format(clazz || ""),
            });

            const $inner: JQuery = $("<span/>");
            this._translator.setTr($inner, key);
            $outer.append($inner);

            if (timeout) {
                this.$cMsgDiv.append($outer);
                setTimeout(
                    () => $(outerId).fadeOut("fast",
                        () => $(outerId).remove()
                    ), timeout);

            } else {
                $(this.$cConstDiv()).remove();
                this.$cMsgDiv.append($outer);
            }
        }
    }
}
