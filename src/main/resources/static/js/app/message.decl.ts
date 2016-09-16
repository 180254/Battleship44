/// <reference path="i18n.decl.ts" />

namespace message {
    "use strict";

    export interface Timeout {

        fast: number;
        default_: number;
        slow: number;
    }

    export interface Message {

        fixed(trKey: i18n.TrKey, clazz?: string): void;

        fleeting(trKey: i18n.TrKey, timeout: number, clazz?: string): void;

        appendFixedLink(trKey: i18n.TrKey, id: string, clazz?: string): void;
    }
}
