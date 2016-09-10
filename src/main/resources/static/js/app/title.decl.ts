/// <reference path="i18n.decl.ts" />

namespace title {
    "use strict";

    export interface Title {

        fixed(key: i18n.Key): void;

        blinking(key: i18n.Key, override: boolean): void;
    }
}