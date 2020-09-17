import {Action, Changer} from './types.decl';
import {
  LangFinder,
  LangSelector,
  LangSetter,
  LangTag,
  LangTagComparison,
  Translator,
  TrKey,
} from './i18n.decl';
import * as $ from 'jquery';
import {Logger} from './logger.decl';
import {LoggerEx} from './logger.impl';
import {Event} from './event0.decl';
import * as Cookies from 'js-cookie';

// extend navigator: add not standard lang tags
// as browsers differently support reporting user lang
// https://gist.github.com/ksol/62b489572944ca70b4ba
declare global {
  export interface Navigator {
    readonly language: string;
    readonly languages: string[];
    readonly userLanguage: string;
    readonly browserLanguage: string;
    readonly systemLanguage: string;
  }
}

// -------------------------------------------------------------------------------------------------------------------

export class LangTagEx implements LangTag {
  public readonly lang: string;
  public readonly region?: string;

  public constructor(lang: string, region?: string) {
    this.lang = lang.toLowerCase();
    this.region = region && region.toUpperCase();
  }

  public static FromString(langTag: string): LangTag {
    const [lang, region]: string[] = langTag.split(/[-_]/);
    return new LangTagEx(lang, region);
  }

  public toString(): string {
    let result: string = this.lang;

    if (this.region !== undefined) {
      result += '-' + this.region;
    }

    return result;
  }
}

// ---------------------------------------------------------------------------------------------------------------

export class LangTagComparisonEx implements LangTagComparison {
  public exactlyMatches(one: LangTag, other: LangTag): boolean {
    const langMatches: boolean = one.lang === other.lang;
    const regionMatches: boolean = one.region === other.region;
    return langMatches && regionMatches;
  }

  public approxMatches(one: LangTag, other: LangTag): boolean {
    const langMatches: boolean = one.lang === other.lang;
    const regionMatches = true;
    return langMatches && regionMatches;
  }
}

// ---------------------------------------------------------------------------------------------------------------

export class LangFinderEx implements LangFinder {
  private readonly _logger: Logger = new LoggerEx(LangFinderEx);

  public cSupported: LangTag[] = [];
  public cCookieName = 'i18n-lang-tag';

  // gist: Language detection in javascript
  // https://gist.github.com/ksol/62b489572944ca70b4ba
  public user(): LangTag[] {
    const tagStrings: string[] = ([] as string[])
      .concat(
        Cookies.get(this.cCookieName)!,
        window.navigator.languages,
        window.navigator.language,

        window.navigator.userLanguage,
        window.navigator.browserLanguage,
        window.navigator.systemLanguage
      )
      .filter(langTagStr => !!langTagStr);

    const result: LangTag[] = tagStrings.map(tagStr =>
      LangTagEx.FromString(tagStr)
    );

    this._logger.trace('result={0}', result);
    return result;
  }

  public server(): LangTag[] {
    this._logger.trace('result={0}', this.cSupported);
    return this.cSupported;
  }
}

// ---------------------------------------------------------------------------------------------------------------

export enum SelectType {
  APPROX = 0,
  EXACTLY = 1,
  DEFAULT = 2,
}

// ---------------------------------------------------------------------------------------------------------------

export class LangSelectorEx implements LangSelector {
  private readonly _logger: Logger = new LoggerEx(LangSelectorEx);

  private readonly _finder: LangFinder;
  private readonly _langTagComp: LangTagComparison;

  public constructor(finder: LangFinder, langTagComparison: LangTagComparison) {
    this._finder = finder;
    this._langTagComp = langTagComparison;
  }

  public select(): [LangTag, SelectType] {
    const server: LangTag[] = this._finder.server();
    const user: LangTag[] = this._finder.user();

    if (server.length === 0) {
      throw new Error('finder.server cannot be empty');
    }

    let fLang: LangTag | undefined;
    let fLang2: LangTag | undefined;
    let fType: SelectType | undefined = undefined;

    for (const userLang of user) {
      // try exact tag, as from user data
      fLang = server.find(supLang =>
        this._langTagComp.exactlyMatches(userLang, supLang)
      );
      if (fLang !== undefined) {
        fType = SelectType.EXACTLY;
        break;
      }

      // or maybe approx tag
      fLang = server.find(supTag =>
        this._langTagComp.approxMatches(userLang, supTag)
      );
      if (fLang !== undefined) {
        fType = SelectType.APPROX;

        // maybe user has exact but on next position?
        fLang2 = user.find(userLang =>
          this._langTagComp.exactlyMatches(userLang, fLang!)
        );
        if (fLang2 !== undefined) {
          fType = SelectType.EXACTLY;
          break;
        }

        // should prefer general, if same region is not available
        const langWithoutRegion: LangTag = new LangTagEx(userLang.lang);
        fLang2 = server.find(supTag =>
          this._langTagComp.exactlyMatches(langWithoutRegion, supTag)
        );
        if (fLang2 !== undefined) {
          fLang = fLang2;
          fType = SelectType.APPROX; // region was ignored
          break;
        }

        break;
      }
    }

    // or first supported (default)
    if (fLang === undefined || fType === undefined) {
      fLang = server[0];
      fType = SelectType.DEFAULT;
    }

    this._logger.trace(
      'result={0},{1}',
      fLang,
      SelectType[fType].toLowerCase()
    );
    return [fLang, fType];
  }
}

// ---------------------------------------------------------------------------------------------------------------

export class LangSetterEx implements LangSetter {
  private readonly _logger: Logger = new LoggerEx(LangSetterEx);

  public cCookieName = 'i18n-lang-tag';

  private readonly _langSelector: LangSelector;

  public constructor(langSelector: LangSelector) {
    this._langSelector = langSelector;
  }

  public getLang(): LangTag {
    const result: [LangTag, SelectType] = this._langSelector.select();
    this._logger.debug(
      'result={0},{1}',
      result[0],
      SelectType[result[1]].toLowerCase()
    );
    return result[0];
  }

  public setLang(lang: LangTag): void {
    this._logger.debug('result={0}', lang);
    Cookies.set(this.cCookieName, lang.toString());
  }
}

// ---------------------------------------------------------------------------------------------------------------

export class TrKeyEx implements TrKey {
  public readonly path: string;
  public readonly params: any[];

  public constructor(path: string, params?: any[] | any) {
    this.path = path;
    this.params = [].concat(params || []);
  }

  public toString(): string {
    return 'KeyEx[path={0} params={1}]'.format(
      this.path,
      this.params.join(',')
    );
  }
}

export function tk(path: string, params?: any[] | any): TrKey {
  return new TrKeyEx(path, params);
}

// ---------------------------------------------------------------------------------------------------------------

export class TranslatorEx implements Translator {
  public readonly onLangChange: Event<number>;

  public cDataAttrPath = 'data-i18n-path';
  public cDataAttrParams = 'data-i18n-params';

  private _strings: any;
  private readonly _langSetter: LangSetter;

  public cPath: Changer<LangTag, string> = lt => '{0}.json'.format(lt);

  public constructor(langSetter: LangSetter, onLangChange: Event<number>) {
    this._langSetter = langSetter;
    this.onLangChange = onLangChange;
  }

  public translate(p: TrKey): string {
    let text: any = this._strings;
    for (const pp of p.path.split('.')) {
      if (Object.prototype.hasOwnProperty.call(text, pp)) {
        text = text[pp];
      } else {
        text = undefined;
        break;
      }
    }

    return typeof text === 'string'
      ? text.format(...p.params)
      : TranslatorEx._translateDefault(p);
  }

  public translatable(): JQuery {
    return $('[{0}]'.format(this.cDataAttrPath));
  }

  private static _translateDefault(p: TrKey): string {
    return '!{0}[{1}]!'.format(p.path, p.params.join(','));
  }

  public setTr($e: JQuery, p?: TrKey): void {
    const path: string = p ? p.path : $e.attr(this.cDataAttrPath)!;

    const params: string[] = p
      ? p.params
      : JSON.parse($e.attr(this.cDataAttrParams) || '[]');

    if (p) {
      $e.attr(this.cDataAttrPath, p.path);
      $e.attr(this.cDataAttrParams, JSON.stringify(p.params));
    }

    $e.text(this.translate(new TrKeyEx(path, params)));
  }

  public setAllTr(): void {
    this.translatable().each((i, elem) => this.setTr($(elem)));
  }

  public unsetTr($e: JQuery): void {
    $e.removeAttr(this.cDataAttrPath);
    $e.removeAttr(this.cDataAttrParams);
  }

  public init(error?: Action, callback?: Action): void {
    const langTag: LangTag = this._langSetter.getLang();
    const jsonPath: string = this.cPath(langTag);

    $.get(jsonPath, data => {
      this._strings = data;
      this.setAllTr();

      this.onLangChange.publish(0);

      if (callback) {
        callback();
      }
    }).fail(() => {
      if (error) {
        error();
      }
    });
  }
}
