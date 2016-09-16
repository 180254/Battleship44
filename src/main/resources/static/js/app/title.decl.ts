/// <reference path="i18n.decl.ts" />

namespace title {
    "use strict";

    export interface Title {

        fixed(trKey: i18n.TrKey): void;

        blinking(trKey: i18n.TrKey, override: boolean): void;
    }
}
