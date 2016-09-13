/// <reference path="i18n.decl.ts" />

namespace message {
    "use strict";

    export interface Timeout {
        fast: number;
        default_: number;
        slow: number;
    }

    export interface Message {

        fixed(key: i18n.TrKey, clazz?: string): void;

        fleeting(key: i18n.TrKey, clazz: string, timeout: number): void;

        appendFixedLink(key: i18n.TrKey, id: string): void;
    }
}
