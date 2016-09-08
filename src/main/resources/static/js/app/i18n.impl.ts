/// <reference path="i18n.decl.ts" />
/// <reference path="string.format.ts" />
/// <reference path="logger.impl.ts" />

"use strict";

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

    export class Conf {  // tslint:disable:no-stateless-class
        public static supported: LangTag[] = [];
        public static cookieName: string = "i18n-lang-tag";
        public static dataAttrPath: string = "data-i18n-path";
        public static dataAttrParams: string = "data-i18n-params";

        public static path: ((lang: LangTag) => string) = (lt) => "{0}.json".format(lt);
    }

    // ---------------------------------------------------------------------------------------------------------------

    export class LangTagEx implements LangTag {
        private _lang: string;
        private _region?: string;

        constructor(lang: string, region?: string) {
            this._lang = lang.toLowerCase();
            this._region = region && region.toUpperCase();
        }

        public static FROM_STRING(langTag: string): LangTag {
            const [lang, region]: string[] = langTag.split(/[-_]/);
            return new LangTagEx(lang, region);
        }

        get lang(): string {
            return this._lang;
        }

        get region(): string | undefined {
            return this._region;
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
                result += "_" + this.region;
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
                    Cookies.get(Conf.cookieName),
                    window.navigator.languages,
                    window.navigator.language,

                    window.navigator.userLanguage,
                    window.navigator.browserLanguage,
                    window.navigator.systemLanguage
                ).filter(langTagStr => !!langTagStr);

            return tagStrings.map(tagStr => LangTagEx.FROM_STRING(tagStr));
        }

        public server(): i18n.LangTag[] {
            return i18n.Conf.supported;
        }
    }

    export class LangSelectorEx implements LangSelector {
        public select(finder: i18n.LangFinder): [LangTag, SelectType] {
            const server: LangTag[] = finder.server();
            const user: LangTag[] = finder.user();

            if (server.length === 0) {
                throw new Error("i18n.LangSelector.select.finder.server cannot be empty");
            }

            logger.i.trace("i18n.LangSelector.user   = [{0}]".format(user));
            logger.i.trace("i18n.LangSelector.server = [{0}]".format(server));

            let lang: LangTag | undefined;
            let lang2: LangTag | undefined;
            let find: SelectType | undefined = undefined;

            for (const userLang of user) {
                // try exact tag, as from user data
                lang = server.find(supLang => userLang.exactlyMatches(supLang));
                if (lang !== undefined) {
                    find = SelectType.EXACTLY;
                    break;
                }

                // or maybe approx tag
                lang = server.find(supTag => userLang.approxMatches(supTag));
                if (lang !== undefined) {
                    find = SelectType.APPROX;

                    // should prefer general, if same region is not available
                    const langWithoutRegion: LangTag = new LangTagEx(userLang.lang);
                    lang2 = server.find(supTag => langWithoutRegion.exactlyMatches(supTag));
                    if (lang2 !== undefined) {
                        lang = lang2;
                        find = SelectType.EXACTLY;
                    }

                    break;
                }
            }

            // or first supported (default)
            if (lang === undefined || find === undefined) {
                lang = server[0];
                find = SelectType.DEFAULT;
            }

            logger.i.trace("i18n.LangSelector.select = [{0}, {1}]".format(lang, SelectType[find].toLowerCase()));
            return [lang, find];
        }
    }

    export class LangSetterEx implements LangSetter {
        public getL(): LangTag {
            const langFinder: LangFinder = new LangFinderEx();
            const langSelector: LangSelector = new LangSelectorEx();
            const result: [LangTag, SelectType] = langSelector.select(langFinder);
            logger.i.debug("i18n.LangSetter.getL     = [{0}, {1}]".format(result[0], SelectType[result[1]].toLowerCase()));
            return result[0];
        }

        public setL(lang: i18n.LangTag): void {
            logger.i.debug("i18n.LangSetter.setL = [{0}]".format(lang));
            Cookies.set(Conf.cookieName, lang.toString());
        }
    }

    // ---------------------------------------------------------------------------------------------------------------

    export class KeyEx implements Key {
        private _path: string; // some.text.key, ex: my name {0} {1}, call me: {2}
        private _params: string[]; // parameters, ex: ["name", "surname", "100-200"]

        constructor(path: string, params: string[] | string) {
            this._path = path;
            this._params = (<string[]> []).concat(params);
        }

        get path(): string {
            return this._path;
        }

        get path_arr(): string[] {
            return this._path.split(".");
        }

        get params(): string[] {
            return this._params;
        }
    }

    // ---------------------------------------------------------------------------------------------------------------

    export class TranslatorEx implements Translator {

        private _langSetter: LangSetter;
        private _strings: any = null;

        constructor(langSetter: i18n.LangSetter) {
            this._langSetter = langSetter;
        }

        public translate(p: KeyEx): string {
            let text: any = this._strings;
            for (const pp of p.path_arr) {
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
            return $("[{0}]".format(Conf.dataAttrPath));
        }

        // noinspection JSMethodCanBeStatic
        private translateDefault(p: KeyEx): string {
            return "!{0}[{1}]!".format(p.path, p.params.join(","));
        }

        public setTr($e: JQuery, p?: KeyEx): void {
            const path: string = p
                ? p.path
                : $e.attr(Conf.dataAttrPath);

            const params: string[] = p
                ? p.params
                : JSON.parse($e.attr(Conf.dataAttrParams) || "[]");

            if (p) {
                $e.attr(Conf.dataAttrPath, p.path);
                $e.attr(Conf.dataAttrParams, JSON.stringify(p.params));
            }

            $e.text(this.translate(new KeyEx(path, params)));
        }

        public setAllTr(): void {
            this.translatable().each((i, elem) => this.setTr($(elem)));
        }

        // noinspection JSMethodCanBeStatic
        public unsetTr($e: JQuery): void {
            $e.removeAttr(Conf.dataAttrPath);
            $e.removeAttr(Conf.dataAttrParams);
        }

        public init(error?: (() => void), callback?: (() => void)): void {
            const langTag: LangTag = this._langSetter.getL();
            const jsonPath: string = Conf.path(langTag);

            $.get(jsonPath, data => {
                this._strings = data;
                this.setAllTr();

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
}
