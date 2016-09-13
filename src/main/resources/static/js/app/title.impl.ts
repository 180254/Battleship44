/// <reference path="title.decl.ts"/>
/// <reference path="i18n.impl.ts"/>

namespace title {
    "use strict";

    export class TitleEx implements Title {

        public cStandardTitle: i18n.TrKey = new i18n.TrKeyEx("standard.title");
        public cBlinkTimeout: number = 1350;

        private readonly _translator: i18n.Translator;
        private _currentTrKeys: i18n.TrKey[] = [];
        private _currentTr: string[] = [];
        private _blinkInterval?: number;

        public constructor(translator: i18n.Translator) {
            this._translator = translator;
            this._translator.onLangChange.subscribe(() => this.updateTr());
        }

        public fixed(key: i18n.TrKey): void {
            this.removeBlinking();

            this._currentTrKeys = [key];
            this.updateTr();
        }

        public blinking(key: i18n.TrKey, override: boolean): void {
            this._currentTrKeys = [this.cStandardTitle, key];
            this.updateTr();

            if (this._blinkInterval === undefined || override) {
                this.removeBlinking();

                let state: number = 0;
                this._blinkInterval = window.setInterval(() => {
                    document.title = this._currentTr[state];
                    state = (state + 1) % 2;
                }, this.cBlinkTimeout);
            }
        }

        private removeBlinking(): void {
            if (this._blinkInterval !== undefined) {
                window.clearInterval(this._blinkInterval);
                this._blinkInterval = undefined;
            }
        }

        private updateTr(): void {
            this._currentTr = this._currentTrKeys.map((e) => this._translator.translate(e));

            if (this._currentTr.length === 1) {
                document.title = this._currentTr[0];
            }
        }
    }
}
