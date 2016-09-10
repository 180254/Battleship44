/// <reference path="i18n.decl.ts" />

namespace title {
    "use strict";

    export interface Title {
        setConst(key: i18n.Key): void;
        setBlink(key: i18n.Key, override: boolean): void;
    }
}
