import {PublisherSubscriber} from './publisher-subscriber';
import {Consumer} from './functional-interfaces';
import {LangSelector, LangSetter, LangTag} from './ui-langs';

export class I18nKey {
  public readonly path: string;
  public readonly params: string[];

  public constructor(path: string, params?: string[] | string) {
    this.path = path;
    this.params = ([] as string[]).concat(params || []);
  }

  public toString(): string {
    return 'I18nKey[{0},{1}]'.format(this.path, this.params.join(','));
  }
}

export function i18nKey(path: string, params?: string[] | string): I18nKey {
  return new I18nKey(path, params);
}

export class Translator {
  public readonly onLangChange = new PublisherSubscriber<number>();

  private readonly dataAttrPath = 'data-i18n-path';
  private readonly dataAttrParams = 'data-i18n-params';
  private translatedStrings!: { [key: string]: string };
  private readonly langSelector: LangSelector;
  private readonly langSetter: LangSetter;

  public constructor(langSelector: LangSelector, langSetter: LangSetter) {
    this.langSelector = langSelector;
    this.langSetter = langSetter;
  }

  private static fileWithTranslations(langTag: LangTag): string {
    return 'i18n/{0}.json'.format(langTag.lang);
  }

  private static getDefaultTranslation(p: I18nKey): string {
    return '!{0}[{1}]!'.format(p.path, p.params.join(','));
  }

  public getLangSelector(): LangSelector {
    return this.langSelector;
  }

  public getLangSetter(): LangSetter {
    return this.langSetter;
  }

  public getTranslation(i18nKey: I18nKey): string {
    let text: string | undefined;

    if (Object.prototype.hasOwnProperty.call(this.translatedStrings, i18nKey.path)) {
      text = this.translatedStrings[i18nKey.path];
    }

    return typeof text === 'string'
      ? text.format(...i18nKey.params)
      : Translator.getDefaultTranslation(i18nKey);
  }

  public translatableElements(): JQuery {
    return $('[{0}]'.format(this.dataAttrPath));
  }

  public translateElement($element: JQuery, i18nKey?: I18nKey): void {
    const path: string = i18nKey ? i18nKey.path : $element.attr(this.dataAttrPath)!;

    const params: string[] = i18nKey
      ? i18nKey.params
      : JSON.parse($element.attr(this.dataAttrParams) || '[]');

    if (i18nKey) {
      $element.attr(this.dataAttrPath, i18nKey.path);
      $element.attr(this.dataAttrParams, JSON.stringify(i18nKey.params));
    }

    $element.text(this.getTranslation(new I18nKey(path, params)));
  }

  public removeTranslation($element: JQuery): void {
    $element.removeAttr(this.dataAttrPath);
    $element.removeAttr(this.dataAttrParams);
  }

  public translateAllElements(): void {
    this.translatableElements().each((i, element) => this.translateElement($(element)));
  }

  public init(onError?: Consumer<unknown>, callback?: Consumer<LangTag>): void {
    const langTag: LangTag = this.langSelector.autoSelect()[0];
    const jsonPath: string = Translator.fileWithTranslations(langTag);

    fetch(jsonPath)
      .then(response => {
        if (!response.ok) {
          throw new Error('network request failed: {0} {1}'.format(response.status, response.statusText));
        }
        return response.json()
      })
      .then(data => {
        this.translatedStrings = data;
        this.translateAllElements();
        this.onLangChange.publish(0);

        if (callback) {
          callback(langTag);
        }
      })
      .catch((err) => {
        if (onError) {
          onError(err);
        }
      });
  }
}
