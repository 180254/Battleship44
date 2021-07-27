import Cookies from 'js-cookie';
import {Environment} from './environment';
import {Logger, LoggerFactory} from './logger';

declare global {
  // extend navigator: add not standard lang tags
  // as browsers differently support reporting user lang
  // https://gist.github.com/ksol/62b489572944ca70b4ba
  export interface NavigatorLanguage {
    readonly language: string;
    readonly languages: ReadonlyArray<string>;
    readonly userLanguage: string;
    readonly browserLanguage: string;
    readonly systemLanguage: string;
  }
}

export class LangTag {
  public readonly lang: string;
  public readonly region?: string;

  public constructor(lang: string, region?: string) {
    this.lang = lang.toLowerCase();
    this.region = region && region.toUpperCase();
  }

  public static FromString(langTag: string): LangTag {
    const [lang, region]: string[] = langTag.split(/[-_]/);
    return new LangTag(lang, region);
  }

  public toString(): string {
    let result: string = this.lang;

    if (this.region !== undefined) {
      result += '-' + this.region;
    }

    return result;
  }
}

export class LangTagComparer {
  public exactlyMatches(one: LangTag, other: LangTag): boolean {
    const langMatches: boolean = one.lang === other.lang;
    const regionMatches: boolean = one.region === other.region;
    return langMatches && regionMatches;
  }

  public approxMatches(one: LangTag, other: LangTag): boolean {
    return one.lang === other.lang;
  }
}

export class LangFinder {
  private readonly logger: Logger = LoggerFactory.getLogger(LangFinder);
  private readonly langTagCookieName = 'i18n';

  // gist: Language detection in javascript
  // https://gist.github.com/ksol/62b489572944ca70b4ba
  public user(): LangTag[] {
    const result: LangTag[] = ([] as string[])
      .concat(
        Cookies.get(this.langTagCookieName)!,
        window.navigator.languages,
        window.navigator.language,
        window.navigator.userLanguage,
        window.navigator.browserLanguage,
        window.navigator.systemLanguage
      )
      .filter(langTagStr => !!langTagStr)
      .map(tagStr => LangTag.FromString(tagStr));

    this.logger.trace('result={0}', result);
    return result;
  }

  public server(): LangTag[] {
    const serverLangTags: LangTag[] = Environment.ServerLanguages.map(val =>
      LangTag.FromString(val)
    );
    this.logger.trace('result={0}', serverLangTags);
    return serverLangTags;
  }
}

export enum LangTagSelectType {
  APPROX = 0,
  EXACTLY = 1,
  DEFAULT = 2,
}

export class LangSelector {
  private readonly logger: Logger = LoggerFactory.getLogger(LangSelector);
  private readonly landTagComparer: LangTagComparer;
  private readonly langFinder: LangFinder;

  public constructor(langTagComparer: LangTagComparer, finder: LangFinder) {
    this.landTagComparer = langTagComparer;
    this.langFinder = finder;
  }

  public getLangFinder(): LangFinder {
    return this.langFinder;
  }

  public autoSelect(): [LangTag, LangTagSelectType] {
    const server: LangTag[] = this.langFinder.server();
    const user: LangTag[] = this.langFinder.user();

    if (server.length === 0) {
      throw new Error('finder.server cannot be empty, set supported lang tags');
    }

    let resultLangTag: LangTag | undefined;
    let resultLangTag2: LangTag | undefined;
    let resultSelectType: LangTagSelectType | undefined;

    for (const userLang of user) {
      // try exact tag, as from user data
      resultLangTag = server.find(serverLang =>
        this.landTagComparer.exactlyMatches(userLang, serverLang)
      );
      if (resultLangTag !== undefined) {
        resultSelectType = LangTagSelectType.EXACTLY;
        break;
      }

      // or maybe approx tag
      resultLangTag = server.find(serverLang =>
        this.landTagComparer.approxMatches(userLang, serverLang)
      );
      if (resultLangTag !== undefined) {
        resultSelectType = LangTagSelectType.APPROX;

        // maybe user has exact but on next position?
        resultLangTag2 = user.find(userLang =>
          this.landTagComparer.exactlyMatches(userLang, resultLangTag!)
        );
        if (resultLangTag2 !== undefined) {
          resultSelectType = LangTagSelectType.EXACTLY;
          break;
        }

        // should prefer general, if same region is not available
        const userLangWithoutRegion: LangTag = new LangTag(userLang.lang);
        resultLangTag2 = server.find(serverLang =>
          this.landTagComparer.exactlyMatches(userLangWithoutRegion, serverLang)
        );
        if (resultLangTag2 !== undefined) {
          resultLangTag = resultLangTag2;
          resultSelectType = LangTagSelectType.APPROX; // region was ignored
          break;
        }

        break;
      }
    }

    // or first supported (default)
    if (resultLangTag === undefined || resultSelectType === undefined) {
      resultLangTag = server[0];
      resultSelectType = LangTagSelectType.DEFAULT;
    }

    this.logger.trace(
      'result={0},{1}',
      resultLangTag,
      LangTagSelectType[resultSelectType].toLowerCase()
    );
    return [resultLangTag, resultSelectType];
  }
}

export class LangSetter {
  private readonly logger: Logger = LoggerFactory.getLogger(LangSetter);
  private readonly langTagCookieName = 'i18n';

  public setLang(langTag: LangTag): void {
    this.logger.trace('result={0}', langTag);
    Cookies.set(this.langTagCookieName, langTag.toString(), {sameSite: 'Strict'});
  }
}
