/// <reference path="message.decl.ts" />
/// <reference path="random.decl.ts" />
/// <reference path="i18n.decl.ts" />
/// <reference path="format.decl.ts" />
/// <reference path="strings.decl.ts" />
/// <reference path="logger.impl.ts" />

namespace message {
    "use strict";

    export class TimeoutEx implements Timeout {

        public readonly fast: number = 1500;
        public readonly default_: number = 2500;
        public readonly slow: number = 5000;
    }

    // ---------------------------------------------------------------------------------------------------------------

    export class MessageEx implements Message {

        private readonly _logger: logger.Logger = new logger.LoggerEx(MessageEx);

        private readonly _random: random.Random;
        private readonly _translator: i18n.Translator;

        private readonly _$MsgDiv: JQuery = $(strings._.message.id);
        private readonly _$ConstDiv: () => string = () => strings._.message.id_const;

        public constructor(random: random.Random,
                           translator: i18n.Translator) {
            this._random = random;
            this._translator = translator;
        }

        public fixed(trKey: i18n.TrKey, clazz?: string): void {
            this._set(trKey, undefined, clazz);
            this._logger.trace("state={0},{1}", trKey, clazz);
        }

        public fleeting(trKey: i18n.TrKey, timeout: number, clazz?: string): void {
            this._set(trKey, timeout, clazz);
            this._logger.trace("state={0},{1},{2}", trKey, timeout, clazz);
        }

        public appendFixedLink(trKey: i18n.TrKey, id: string, clazz?: string): void {
            const $a: JQuery = $("<a/>", {
                ["href"]: "#",
                ["id"]: id,
                ["class"]: clazz || "",
            });

            this._translator.setTr($a, trKey);
            $(this._$ConstDiv()).append($a);

            this._logger.trace("state={0},{1},{2}", trKey, id, clazz);
        }

        private _set(key: i18n.TrKey, timeout?: number, clazz?: string): void {
            const outerId: string =
                timeout
                    ? "#{0}".format(this._random.str(7, "a"))
                    : this._$ConstDiv();

            const $outer: JQuery = $("<span/>", {
                ["id"]: outerId,
                ["class"]: "{0} msg".format(clazz || ""),
            });

            const $inner: JQuery = $("<span/>");
            this._translator.setTr($inner, key);
            $outer.append($inner);

            if (timeout) {
                this._$MsgDiv.append($outer);
                setTimeout(
                    () => $(outerId).fadeOut("fast",
                        () => $(outerId).remove()
                    ), timeout);

            } else {
                $(this._$ConstDiv()).remove();
                this._$MsgDiv.append($outer);
            }
        }
    }
}
