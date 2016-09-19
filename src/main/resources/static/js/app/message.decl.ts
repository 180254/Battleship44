/// <reference path="i18n.decl.ts" />

declare namespace message {

    interface Timeout {

        readonly fast: number;
        readonly default_: number;
        readonly slow: number;
    }

    // ---------------------------------------------------------------------------------------------------------------

    interface Message {

        fixed(trKey: i18n.TrKey, clazz?: string): void;

        fleeting(trKey: i18n.TrKey, timeout: number, clazz?: string): void;

        appendFixedLink(trKey: i18n.TrKey, id: string, clazz?: string): void;
    }
}
