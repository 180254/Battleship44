/// <reference path="i18n.decl.ts" />

declare namespace message {

    interface Timeout {

        readonly fast: number;
        readonly default_: number;
        readonly slow: number;
    }

    // ---------------------------------------------------------------------------------------------------------------

    interface Message {

        setFixed(trKey: i18n.TrKey, clazz?: string): void;

        addFleeting(trKey: i18n.TrKey, timeout: number, clazz?: string): void;

        addFixedLink(trKey: i18n.TrKey, id: string, clazz?: string): void;
    }
}
