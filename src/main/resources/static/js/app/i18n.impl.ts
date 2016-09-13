/// <reference path="i18n.decl.ts" />
/// <reference path="string.format.ts" />
/// <reference path="logger.impl.ts" />
/// <reference path="event0.impl.ts" />

// extend navigator: add not standard lang tags
// as browsers differently support reporting user lang
// https://gist.github.com/ksol/62b489572944ca70b4ba
interface Navigator {
    readonly language: string;
    readonly languages: string[];
    readonly userLanguage: string;
    readonly browserLanguage: string;
    readonly systemLanguage: string;
}

// -------------------------------------------------------------------------------------------------------------------

namespace i18n {
    "use strict";

    class Conf {
        public supported/*_languages*/: LangTag[] = [];
        public cookieName: string = "i18n-lang-tag";
        public dataAttrPath: string = "data-i18n-path";
        public dataAttrParams: string = "data-i18n-params";

        public path: ((lang: LangTag) => string) = (lt) => "{0}.json".format(lt);
    }

    export const conf: Conf = new Conf();

    // ---------------------------------------------------------------------------------------------------------------

    export class LangTagEx implements LangTag {

        public readonly lang: string;
        public readonly region?: string;

        public constructor(lang: string, region?: string) {
            this.lang = lang.toLowerCase();
            this.region = region && region.toUpperCase();
        }

        public static FROM_STRING(langTag: string): LangTag {
            const [lang, region]: string[] = langTag.split(/[-_]/);
            return new LangTagEx(lang, region);
        }

        public exactlyMatches(other: LangTag): boolean {
            const langMatches: boolean = this.lang === other.lang;
            const regionMatches: boolean = this.region === other.region;
            return langMatches && regionMatches;
        }

        public approxMatches(other: LangTag): boolean {
            const langMatches: boolean = this.lang === other.lang;
            const regionMatches: boolean = true;
            return langMatches && regionMatches;
        }

        public toString(): string {
            let result: string = this.lang;

            if (this.region !== undefined) {
                result += "-" + this.region;
            }

            return result;
        }
    }

    // ---------------------------------------------------------------------------------------------------------------

    export class LangFinderEx implements LangFinder {
        // gist: Language detection in javascript
        // https://gist.github.com/ksol/62b489572944ca70b4ba
        public user(): LangTag[] {
            const tagStrings: string[] = (<string[]> [])
                .concat(
                    Cookies.get(conf.cookieName),
                    window.navigator.languages,
                    window.navigator.language,

                    window.navigator.userLanguage,
                    window.navigator.browserLanguage,
                    window.navigator.systemLanguage
                ).filter(langTagStr => !!langTagStr);

            return tagStrings.map(tagStr => LangTagEx.FROM_STRING(tagStr));
        }

        public server(): LangTag[] {
            return conf.supported;
        }
    }

    export class LangSelectorEx implements LangSelector {

        private readonly _finder: LangFinder;

        public constructor(finder: LangFinder) {
            this._finder = finder;
        }

        public select(): [LangTag, SelectType] {
            const server: LangTag[] = this._finder.server();
            const user: LangTag[] = this._finder.user();

            if (server.length === 0) {
                throw new Error("finder.server cannot be empty");
            }

            logger.i.trace(["i18n", LangSelectorEx, this.select], "user=[{0}]", user);
            logger.i.trace(["i18n", LangSelectorEx, this.select], "server=[{0}]", server);

            let fLang: LangTag | undefined;
            let fLang2: LangTag | undefined;
            let fType: SelectType | undefined = undefined;

            for (const userLang of user) {
                // try exact tag, as from user data
                fLang = server.find(supLang => userLang.exactlyMatches(supLang));
                if (fLang !== undefined) {
                    fType = SelectType.EXACTLY;
                    break;
                }

                // or maybe approx tag
                fLang = server.find(supTag => userLang.approxMatches(supTag));
                if (fLang !== undefined) {
                    fType = SelectType.APPROX;

                    // maybe user has exact but on next position?
                    fLang2 = user.find(userLang => userLang.exactlyMatches(fLang!));
                    if (fLang2 !== undefined) {
                        fType = SelectType.EXACTLY;
                        break;
                    }

                    // should prefer general, if same region is not available
                    const langWithoutRegion: LangTag = new LangTagEx(userLang.lang);
                    fLang2 = server.find(supTag => langWithoutRegion.exactlyMatches(supTag));
                    if (fLang2 !== undefined) {
                        fLang = fLang2;
                        fType = SelectType.EXACTLY;
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

            logger.i.trace(["i18n", LangSelectorEx, this.select],
                "select=[{0},{1}]", fLang, SelectType[fType].toLowerCase()
            );

            return [fLang, fType];
        }
    }

    export class LangSetterEx implements LangSetter {

        private readonly _langSelector: LangSelector;

        public constructor(langSelector: i18n.LangSelector) {
            this._langSelector = langSelector;
        }

        public getLang(): LangTag {
            const result: [LangTag, SelectType] = this._langSelector.select();

            logger.i.debug(["i18n", LangSetterEx, this.getLang],
                "[{0},{1}]", result[0], SelectType[result[1]].toLowerCase()
            );

            return result[0];
        }

        public setLang(lang: LangTag): void {
            logger.i.debug(["i18n", LangSetterEx, this.setLang], "[{0}]", lang);
            Cookies.set(conf.cookieName, lang.toString());
        }
    }

    // ---------------------------------------------------------------------------------------------------------------

    export class KeyEx implements Key {

        public readonly path: string;
        public readonly params: string[];

        public constructor(path: string, params?: string[] | string) {
            this.path = path;
            this.params = (<string[]> []).concat(params || []);
        }

        public toString(): string {
            return "KeyEx[path={0} params={1}]".format(this.path, this.params.join(","));
        }
    }

    // ---------------------------------------------------------------------------------------------------------------

    export class TranslatorEx implements Translator {

        private _strings: any;
        private readonly _langSetter: LangSetter;
        public readonly onLangChange: event0.Event<number>;

        public constructor(langSetter: i18n.LangSetter,
                           onLangChange: event0.Event<number>) {
            this._langSetter = langSetter;
            this.onLangChange = onLangChange;
        }

        public translate(p: Key): string {
            let text: any = this._strings;
            for (const pp of p.path.split(".")) {
                if (text.hasOwnProperty(pp)) {
                    text = text[pp];
                } else {
                    text = undefined;
                    break;
                }
            }

            return typeof text === "string"
                ? (<string> text).format(...p.params)
                : this.translateDefault(p);
        }

        public translatable(): JQuery {
            return $("[{0}]".format(conf.dataAttrPath));
        }

        // noinspection JSMethodCanBeStatic
        private translateDefault(p: Key): string {
            return "!{0}[{1}]!".format(p.path, p.params.join(","));
        }

        public setTr($e: JQuery, p?: Key): void {
            const path: string = p
                ? p.path
                : $e.attr(conf.dataAttrPath);

            const params: string[] = p
                ? p.params
                : JSON.parse($e.attr(conf.dataAttrParams) || "[]");

            if (p) {
                $e.attr(conf.dataAttrPath, p.path);
                $e.attr(conf.dataAttrParams, JSON.stringify(p.params));
            }

            $e.text(this.translate(new KeyEx(path, params)));
        }

        public setAllTr(): void {
            this.translatable().each((i, elem) => this.setTr($(elem)));
        }

        public unsetTr($e: JQuery): void {
            $e.removeAttr(conf.dataAttrPath);
            $e.removeAttr(conf.dataAttrParams);
        }

        public init(error?: (() => void), callback?: (() => void)): void {
            const langTag: LangTag = this._langSetter.getLang();
            const jsonPath: string = conf.path(langTag);

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

    // ---------------------------------------------------------------------------------------------------------------

    class Singleton {
        public finder: LangFinder = new LangFinderEx();
        public selector: LangSelector = new LangSelectorEx(this.finder);
        public setter: LangSetter = new LangSetterEx(this.selector);
        public translator: Translator = new TranslatorEx(this.setter, new event0.EventEx());
    }

    export const i: Singleton = new Singleton();
}
