/// <reference path="i18n.decl.ts"/>
/// <reference path="types.decl.ts"/>

declare namespace ui {

    interface Ui {

        initFlags(callback: Callback<i18n.LangTag>): void;
    }
}
