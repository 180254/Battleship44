import {Translator, TrKey} from './i18n.decl';
import {Title} from './title.decl';
import {Logger} from './logger.decl';
import {LoggerEx} from './logger.impl';

export class TitleEx implements Title {
  private readonly _logger: Logger = new LoggerEx(TitleEx);

  public cStandardTitle: TrKey = {
    path: 'title.standard',
    params: [],
  };
  public cBlinkTimeout = 1350;

  private _currentTrKeys: TrKey[] = [];
  private _currentTr: string[] = [];
  private _blinkInterval?: number;

  private readonly _translator: Translator;

  public constructor(translator: Translator) {
    this._translator = translator;
    this._translator.onLangChange.subscribe(() => this._updateTr());
  }

  public setFixed(key: TrKey): void {
    this._removeBlinking();
    this._updateTr([key]);

    this._logger.trace('state={0},{1}', this._currentTrKeys, this._currentTr);
  }

  public setBlinking(key: TrKey, override: boolean): void {
    this._updateTr([this.cStandardTitle, key]);

    if (this._blinkInterval === undefined || override) {
      this._removeBlinking();

      let state = 0;
      this._blinkInterval = window.setInterval(() => {
        document.title = this._currentTr[state];
        state = (state + 1) % 2;
      }, this.cBlinkTimeout);
    }

    this._logger.trace(
      'state={0},{1},{2}',
      this._currentTrKeys,
      this._currentTr,
      override
    );
  }

  private _removeBlinking(): void {
    if (this._blinkInterval !== undefined) {
      window.clearInterval(this._blinkInterval);
      this._blinkInterval = undefined;
    }
  }

  private _updateTr(trKeys?: TrKey[]): void {
    if (trKeys !== undefined) {
      this._currentTrKeys = trKeys;
    }

    this._currentTr = this._currentTrKeys.map(e =>
      this._translator.translate(e)
    );

    if (this._currentTr.length === 1) {
      document.title = this._currentTr[0];
    }
  }
}
