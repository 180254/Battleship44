import {Logger, LoggerFactory} from './logger';
import * as Cookies from 'js-cookie';

declare global {
  // extend navigator: add not standard lang tags
  // as browsers differently support reporting user lang
  // https://gist.github.com/ksol/62b489572944ca70b4ba
  export interface Navigator {
    readonly language: string;
    readonly languages: string[];
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

export const ServerSupportedLangs: LangTag[] = [
  LangTag.FromString('pl-pl'),
  LangTag.FromString('en-us'),
];

export class LangFinder {
  private readonly logger: Logger = LoggerFactory.getLogger(LangFinder);
  private readonly langTagCookieName = 'i18n-lang-tag';

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
    this.logger.trace('result={0}', ServerSupportedLangs);
    return ServerSupportedLangs;
  }
}

export enum LangTagSelectType {
  APPROX = 0,
  EXACTLY = 1,
  DEFAULT = 2,
}

export class LangSelector {
  private readonly logger: Logger = LoggerFactory.getLogger(LangSelector);
  private readonly langFinder: LangFinder;
  private readonly landTagComparer: LangTagComparer;

  public constructor(finder: LangFinder, langTagComparison: LangTagComparer) {
    this.langFinder = finder;
    this.landTagComparer = langTagComparison;
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

    let resultLandTag: LangTag | undefined;
    let resultLandTag2: LangTag | undefined;
    let resultSelectType: LangTagSelectType | undefined = undefined;

    for (const userLang of user) {
      // try exact tag, as from user data
      resultLandTag = server.find(serverLang =>
        this.landTagComparer.exactlyMatches(userLang, serverLang)
      );
      if (resultLandTag !== undefined) {
        resultSelectType = LangTagSelectType.EXACTLY;
        break;
      }

      // or maybe approx tag
      resultLandTag = server.find(serverLang =>
        this.landTagComparer.approxMatches(userLang, serverLang)
      );
      if (resultLandTag !== undefined) {
        resultSelectType = LangTagSelectType.APPROX;

        // maybe user has exact but on next position?
        resultLandTag2 = user.find(userLang =>
          this.landTagComparer.exactlyMatches(userLang, resultLandTag!)
        );
        if (resultLandTag2 !== undefined) {
          resultSelectType = LangTagSelectType.EXACTLY;
          break;
        }

        // should prefer general, if same region is not available
        const userLangWithoutRegion: LangTag = new LangTag(userLang.lang);
        resultLandTag2 = server.find(serverLang =>
          this.landTagComparer.exactlyMatches(userLangWithoutRegion, serverLang)
        );
        if (resultSelectType !== undefined) {
          resultLandTag = resultLandTag2;
          resultSelectType = LangTagSelectType.APPROX; // region was ignored
          break;
        }

        break;
      }
    }

    // or first supported (default)
    if (resultLandTag === undefined || resultSelectType === undefined) {
      resultLandTag = server[0];
      resultSelectType = LangTagSelectType.DEFAULT;
    }

    this.logger.trace(
      'result={0},{1}',
      resultLandTag,
      LangTagSelectType[resultSelectType].toLowerCase()
    );
    return [resultLandTag, resultSelectType];
  }
}

export class LangSetter {
  private readonly logger: Logger = LoggerFactory.getLogger(LangSetter);
  private readonly langSelector: LangSelector;
  private readonly langTagCookieName = 'i18n-lang-tag';

  public constructor(langSelector: LangSelector) {
    this.langSelector = langSelector;
  }

  public setLang(langTag: LangTag): void {
    this.logger.debug('result={0}', langTag);
    Cookies.set(this.langTagCookieName, langTag.toString(), {
      sameSite: 'Strict',
    });
  }
}
