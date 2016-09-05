/// <reference path="format.ts" />
/// <reference path="logger.ts" />

"use strict";

// extend navigator: add not standard lang tags
// as browsers differently support reporting user lang
// check i18n.Setter.get()._userLangTags() comment
// noinspection JSUnusedGlobalSymbols
interface Navigator {
    readonly language: string;
    readonly languages: string[];
    readonly userLanguage: string;
    readonly browserLanguage: string;
    readonly systemLanguage: string;
}

// -------------------------------------------------------------------------------------------------------------------

namespace i18n {

    export class Conf {
        public static supported: LangTag[] = [];
        public static cookieName: string = "i18n-lang-tag";
        public static dataAttrPath: string = "data-i18n-path";
        public static dataAttrParams: string = "data-i18n-params";

        public static path: ((langTag: LangTag) => string) = (lt) => "{0}.json".format(lt);
    }

    // ---------------------------------------------------------------------------------------------------------------

    /**
     * LangTag - lang-region
     * Examples: en, en-us, en-US
     */
    export class LangTag {
        private _lang: string;
        private _region?: string;

        constructor(lang: string, region?: string) {
            this._lang = lang.toLowerCase();
            this._region = region && region.toUpperCase();
        }

        public static fromString(langTag: string): LangTag {
            if (langTag.length === 0) {
                throw new Error(`{langTag}: not a lang tag`);
            }

            const [lang, region]: string[] = langTag.split(/[-_]/);
            return new LangTag(lang, region);
        }

        get lang(): string {
            return this._lang;
        }

        get region(): string | undefined {
            return this._region;
        }

        /**
         * Exact match. It is just equals.
         *
         * true  | this: en-us -> other: en-us
         * true  | this: en-?? -> other: en-??
         * false | this: en-?? -> other: en-us
         * false | this: en-us -> other: en-??, en-gb
         *
         * @param other
         * @returns {boolean}
         */
        public exactlyMatches(other: LangTag): boolean {
            const langMatches: boolean = this._lang === other._lang;
            const regionMatches: boolean = this._region === other._region;
            return langMatches && regionMatches;
        }

        /**
         * Approx match. It is not equals as doesn't meet equals rules!
         * Approx = region doesn't matter.
         *
         * true  | this: en-us -> other: en-us, en-gb, en-??
         * true  | this: en-?? -> other: en-??, en-us, en-gb
         * false | this: en-us -> other: pl-pl, pl-us
         *
         * @param other
         * @returns {boolean}
         */
        public approxMatches(other: LangTag): boolean {
            const langMatches: boolean = this._lang === other._lang;
            const regionMatches: boolean = true;
            return langMatches && regionMatches;
        }

        public toString(): string {
            let result: string = this._lang;

            if (this._region !== undefined) {
                result += "-" + this._region;
            }

            return result;
        }
    }

    // ---------------------------------------------------------------------------------------------------------------

    export class Setter {

        // gist: Language detection in javascript
        // https://gist.github.com/ksol/62b489572944ca70b4ba
        private static _user(): LangTag[] {
            const tagStrings: string[] = (<string[]> [])
                .concat(
                    Cookies.get(Conf.cookieName),
                    window.navigator.languages,
                    window.navigator.language,

                    window.navigator.userLanguage,
                    window.navigator.browserLanguage,
                    window.navigator.systemLanguage
                ).filter(langTagStr => !!langTagStr);

            return tagStrings.map(tagStr => LangTag.fromString(tagStr));
        }

        public static get(): LangTag {
            if (Conf.supported.length === 0) {
                throw new Error("let's conf i18n.supported");
            }

            const userTags: LangTag[] = this._user();
            let selected: LangTag | undefined;

            logger.trace("i18n.prefer = [{0}]".format(userTags));
            logger.trace("i18n.supported = [{0}]".format(Conf.supported));

            for (let userTag of userTags) {
                // try exact tag, as from user data
                selected = Conf.supported.find(supTag => userTag.exactlyMatches(supTag));
                if (selected !== undefined) {
                    logger.debug("i18n.get = exact[{0}]".format(selected));
                    break;
                }

                // or maybe approx tag
                selected = Conf.supported.find(supTag => userTag.approxMatches(supTag));
                if (selected !== undefined) {
                    logger.debug("i18n.get = approx[{0}]".format(selected));
                    break;
                }
            }

            // or first supported (default)
            if (selected === undefined) {
                selected = Conf.supported[0];
                logger.debug("i18n.get = default[{0}]".format(selected));
            }

            return selected;
        }

        public static set(langTag: LangTag): void {
            logger.debug("i18n.set = [{0}]".format(langTag));
            Cookies.set(Conf.cookieName, langTag.toString());
        }
    }

    // ---------------------------------------------------------------------------------------------------------------

    export class KeyEx {
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

    export class Translator {

        private _strings: any = null;

        public translate(p: KeyEx): string {
            let text: any = this._strings;
            for (let pp of p.path_arr) {
                if (text.hasOwnProperty(pp)) {
                    text = text[pp];
                } else {
                    text = undefined;
                    break;
                }
            }

            return typeof text === "string"
                ? (<string> text).format(...p.params)
                : this._translateDefault(p);
        }

        // noinspection JSMethodCanBeStatic
        private  _translateDefault(p: KeyEx): string {
            return "!{0}[{1}]!".format(p.path, p.params.join(","));
        }

        public set($e: JQuery, p?: KeyEx): void {
            let path: string = p
                ? p.path
                : $e.attr(Conf.dataAttrPath);

            let params: string[] = p
                ? p.params
                : JSON.parse($e.attr(Conf.dataAttrParams) || "[]");

            if (p) {
                $e.attr(Conf.dataAttrPath, p.path);
                $e.attr(Conf.dataAttrParams, JSON.stringify(p.params));
            }

            $e.text(this.translate(new KeyEx(path, params)));
        }

        public setAll(): void {
            $("[{0}]".format(Conf.dataAttrPath)).each((i, elem) => this.set($(elem)));
        }

        // noinspection JSMethodCanBeStatic
        public unset($e: JQuery): void {
            $e.removeAttr(Conf.dataAttrPath);
            $e.removeAttr(Conf.dataAttrParams);
        }

        public init(error?: (() => void), callback?: (() => void)): void {
            const langTag: LangTag = i18n.Setter.get();
            const jsonPath: string = Conf.path(langTag);

            $.get(jsonPath, data => {
                this._strings = data;
                this.setAll();

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
