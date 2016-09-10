/// <reference path="title.decl.ts"/>
/// <reference path="i18n.impl.ts"/>

namespace title {
    "use strict";

    class Conf {
        public standardTitle: i18n.Key = new i18n.KeyEx("standard.title");
        public blinkTimeout: number = 1350;
    }

    export const conf: Conf = new Conf();

    // ---------------------------------------------------------------------------------------------------------------

    export class TitleEx implements Title {

        private readonly _translator: i18n.Translator;
        private _currentKeys: i18n.Key[] = [];
        private _currentTr: string[] = [];

        private _blinkInterval: number | undefined;

        constructor(translator: i18n.Translator) {
            this._translator = translator;
            this._translator.onLangChange.subscribers.push(() => this.updateTr());
        }

        public setConst(key: i18n.Key): void {
            this.removeBlinkInterval();

            this._currentKeys = [key];
            this.updateTr();
        }

        public setBlink(key: i18n.Key, override: boolean): void {
            this._currentKeys = [conf.standardTitle, key];
            this.updateTr();

            if (this._blinkInterval !== undefined || override) {
                this.removeBlinkInterval();

                let state: number = 0;
                this._blinkInterval = window.setInterval(() => {
                    document.title = this._currentTr[state];
                    state = (state + 1) % 2;
                }, conf.blinkTimeout);
            }
        }

        private removeBlinkInterval(): void {
            if (this._blinkInterval !== undefined) {
                window.clearInterval(this._blinkInterval);
                this._blinkInterval = undefined;
            }
        }

        private updateTr(): void {
            this._currentTr = this._currentKeys.map((e) => this._translator.translate(e));

            if (this._currentTr.length === 1) {
                document.title = this._currentTr[0];
            }
        }
    }

    // ---------------------------------------------------------------------------------------------------------------

    export let i: Title = new TitleEx(i18n.i.translator);
}
