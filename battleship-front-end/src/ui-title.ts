import {Logger, LoggerFactory} from './logger';
import {I18nKey, Translator} from './ui-i18n';

export class UiTitle {
  private readonly logger: Logger = LoggerFactory.getLogger(UiTitle);

  private readonly defaultTitleI18nKey: I18nKey = new I18nKey('title.default');
  private readonly blinkingTimeoutMs = 1350;

  private currentI18nKey: I18nKey[] = [];
  private currentI18nText: string[] = [];
  private blinkIntervalHandler?: number;

  private readonly translator: Translator;

  public constructor(translator: Translator) {
    this.translator = translator;
    this.translator.onLangChange.subscribe(() => this.updateTranslation());
  }

  public setFixedDefaultTitle(): void {
    this.setFixedTitle(this.defaultTitleI18nKey);
  }

  public setFixedTitle(i18nKey: I18nKey): void {
    this.removeBlinking();
    this.updateTranslation([i18nKey]);

    this.logger.trace('{0}', i18nKey);
  }

  public setBlinkingTitle(i18nKey: I18nKey, override: boolean): void {
    this.updateTranslation([this.defaultTitleI18nKey, i18nKey]);

    if (this.blinkIntervalHandler === undefined || override) {
      this.removeBlinking();

      let state = 0;
      this.blinkIntervalHandler = window.setInterval(() => {
        document.title = this.currentI18nText[state];
        state = (state + 1) % 2;
      }, this.blinkingTimeoutMs);
    }

    this.logger.trace('{0},{1}', i18nKey, override);
  }

  private removeBlinking(): void {
    if (this.blinkIntervalHandler !== undefined) {
      window.clearInterval(this.blinkIntervalHandler);
      this.blinkIntervalHandler = undefined;
    }
  }

  private updateTranslation(u18nKeys?: I18nKey[]): void {
    if (u18nKeys !== undefined) {
      this.currentI18nKey = u18nKeys;
    }

    this.currentI18nText = this.currentI18nKey.map(i18nKey =>
      this.translator.getTranslation(i18nKey)
    );

    if (this.currentI18nText.length === 1) {
      document.title = this.currentI18nText[0];
    }
  }
}
