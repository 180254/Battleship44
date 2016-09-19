/// <reference path="i18n.decl.ts" />

declare namespace title {

    interface Title {

        fixed(trKey: i18n.TrKey): void;

        blinking(trKey: i18n.TrKey, override: boolean): void;
    }
}
