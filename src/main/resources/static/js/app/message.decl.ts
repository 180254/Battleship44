/// <reference path="i18n.decl.ts" />

namespace message {
    "use strict";

    export interface Timeout {
        fast: number;
        default_: number;
        slow: number;
    }

    export interface Message {

        fixed(key: i18n.Key, clazz: string): void;

        appendLink(key: i18n.Key, id: string): void;

        fleeting(key: i18n.Key, clazz: string, timeout: number): void;
    }
}
