/// <reference path="i18n.decl.ts"/>

namespace ui {

    export interface Ui {

        initFlags(callback: (e: i18n.LangTag) => void): void;
    }
}
