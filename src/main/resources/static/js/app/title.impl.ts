/// <reference path="title.decl.ts"/>
/// <reference path="i18n.decl.ts"/>
/// <reference path="logger.impl.ts"/>

namespace title {
    "use strict";

    export class TitleEx implements Title {

        private readonly _logger: logger.Logger = new logger.LoggerEx(TitleEx);

        public cStandardTitle: i18n.TrKey = {path: "title.standard", params: []};
        public cBlinkTimeout: number = 1350;

        private _currentTrKeys: i18n.TrKey[] = [];
        private _currentTr: string[] = [];
        private _blinkInterval?: number;

        private readonly _translator: i18n.Translator;

        public constructor(translator: i18n.Translator) {
            this._translator = translator;
            this._translator.onLangChange.subscribe(() => this._updateTr());
        }

        public setFixed(key: i18n.TrKey): void {
            this._removeBlinking();
            this._updateTr([key]);

            this._logger.trace(
                "state={0},{1}",
                this._currentTrKeys, this._currentTr
            );
        }

        public setBlinking(key: i18n.TrKey, override: boolean): void {
            this._updateTr([this.cStandardTitle, key]);

            if (this._blinkInterval === undefined || override) {
                this._removeBlinking();

                let state: number = 0;
                this._blinkInterval = window.setInterval(() => {
                    document.title = this._currentTr[state];
                    state = (state + 1) % 2;
                }, this.cBlinkTimeout);
            }

            this._logger.trace(
                "state={0},{1},{2}",
                this._currentTrKeys, this._currentTr, override
            );
        }

        private _removeBlinking(): void {
            if (this._blinkInterval !== undefined) {
                window.clearInterval(this._blinkInterval);
                this._blinkInterval = undefined;
            }
        }

        private _updateTr(trKeys?: i18n.TrKey[]): void {
            if (trKeys !== undefined) {
                this._currentTrKeys = trKeys;
            }

            this._currentTr = this._currentTrKeys
                .map((e) => this._translator.translate(e));

            if (this._currentTr.length === 1) {
                document.title = this._currentTr[0];
            }
        }
    }
}
