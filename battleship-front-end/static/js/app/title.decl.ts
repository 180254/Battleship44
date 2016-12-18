/// <reference path="i18n.decl.ts" />

declare namespace title {

    interface Title {

        setFixed(trKey: i18n.TrKey): void;

        setBlinking(trKey: i18n.TrKey, override: boolean): void;
    }
}
