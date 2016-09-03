/// <reference path="typings/index.d.ts" />
/// <reference path="string.format.ts" />
/// <reference path="logger.ts" />

"use strict";

// extend navigator: add not standard lang tags
// as browsers differently support reporting user lang
// check i18n.Setter.get().userLangCodes comment
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

    const _cookieName: string = "b44_lang_code";
    const _dataAttrPath: string = "data-i18n-path";
    const _dataAttrParams: string = "data-i18n-params";

    export let supported: Lang[] = [];

    // ---------------------------------------------------------------------------------------------------------------

    export class Lang {
        private _code: string;
        private _country: string;

        constructor(code: string, country: string) {
            this._code = code;
            this._country = country;
        }

        get code(): string {
            return this._code;
        }

        get country(): string {
            return this._country;
        }
    }

    // ---------------------------------------------------------------------------------------------------------------

    export class Setter {

        public static get(): Lang {
            if (i18n.supported.length === 0) {
                throw new Error("specify supported lang");
            }

            // gist: Language detection in javascript
            // https://gist.github.com/ksol/62b489572944ca70b4ba
            // may be en-US, en-us, en_US(?), or just en
            const userLangCodes: string[] = (<string[]> []).concat(
                Cookies.get(_cookieName),
                window.navigator.language,
                window.navigator.languages,
                window.navigator.userLanguage,
                window.navigator.userLanguage,
                window.navigator.systemLanguage
            ).filter((userLangCode: string) => !!userLangCode);

            let selectedLang: Lang = i18n.supported[0];
            for (let userLangCode of userLangCodes) {
                // map: need iso (en) not language tag (en-us)
                const userLangCodeIso: string
                    = userLangCode!.split(/[-_]/).shift()!.toLowerCase();

                const find: Lang | undefined
                    = i18n.supported.find((supLang: Lang) => supLang.code === userLangCodeIso);

                if (find !== undefined) {
                    selectedLang = find;
                    break;
                }
            }

            logger.debug("i18n.Setter.get - " + JSON.stringify(selectedLang));
            return selectedLang;
        }

        public static setLang(lang: Lang): void {
            logger.debug("debug: i18n.String.set - " + lang.code);
            Cookies.set(_cookieName, lang.code);
        }

        public static setLangCode(code: string): void {
            this.setLang(new Lang(code, ""));
        }
    }

    // ---------------------------------------------------------------------------------------------------------------

    export class P {
        private _path: string;
        private _params: string[];

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

        private static _default(p: P): string {
            return "<{0} [{1}]>".format(p.path, p.params.join(","));
        }

        private _strings: any = null;

        public translate(p: P): string {
            if (p.path_arr.length !== 2) {
                return i18n.Translator._default(p);
            }

            let text: any = this._strings;
            for (let pp of p.path_arr) {
                if (text.hasOwnProperty(pp)) {
                    text = text[pp];
                } else {
                    text = undefined;
                    break;
                }
            }

            if (typeof text !== "string") {
                return i18n.Translator._default(p);
            }

            return (<string> text).format(...p.params);
        }

        public set($e: JQuery, p?: P): void {
            let path: string = p
                ? p.path
                : $e.attr(_dataAttrPath);

            let params: string[] = p
                ? p.params
                : JSON.parse($e.attr(_dataAttrParams) || "[]");

            if (p) {
                $e.attr(_dataAttrPath, p.path);
                $e.attr(_dataAttrParams, JSON.stringify(p.params));
            }

            $e.text(this.translate(new P(path, params)));
        }

    }
}
