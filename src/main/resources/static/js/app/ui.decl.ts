/// <reference path="i18n.decl.ts"/>

declare namespace ui {

    interface Ui {

        initFlags(callback: (e: i18n.LangTag) => void): void;
    }
}
