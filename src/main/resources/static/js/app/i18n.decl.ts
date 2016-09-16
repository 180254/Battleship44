/// <reference path="event0.decl.ts"/>

namespace i18n {
    "use strict";

    /**
     * LangTag - lang-region
     * Examples: en, en-US
     */
    export interface LangTag {

        readonly lang: string;
        readonly region?: string;
    }

    /**
     * Compare lang tag.
     */
    export interface LangTagComparison {
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
        exactlyMatches(one: LangTag, other: LangTag): boolean;

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
        approxMatches(one: LangTag, other: LangTag): boolean;
    }

    /**
     * Find languages supported by user & by server.
     */
    export interface LangFinder {

        user(): LangTag[];
        server(): LangTag[];
    }

    /**
     * Select best language, which is supported by server, and wanted by user.
     */
    export interface LangSelector {

        select(): [LangTag, SelectType];
    }

    /**
     * Type of lang selection.
     * approx - server LangTag "approxMatches" user one
     * exactly - server LangTag "exactlyMatches" user one
     * default - server default lang
     */
    export enum SelectType {
        APPROX = 0,
        EXACTLY = 1,
        DEFAULT = 2
    }

    /**
     * Set lang preference in user data.
     */
    export interface LangSetter {

        getLang(): LangTag;
        setLang(langTag: LangTag): void;
    }

    /**
     * Translate key.
     * path   = some.text.key, ex value: "my name {0} {1}, call me: {2}"
     * params = parameters, ex: ["name", "surname", "100-200"]
     */
    export interface TrKey {

        readonly path: string;
        readonly params: string[];
    }

    /**
     * Translator.
     */
    export interface Translator {
        readonly onLangChange: event0.Event<number>;

        translate(p: TrKey): string;
        translatable(): JQuery;

        setTr($e: JQuery, p?: TrKey): void;
        setAllTr($e: JQuery, p?: TrKey): void;
        unsetTr($e: JQuery): void;

        init(error?: (() => void), callback?: (() => void)): void;
    }
}
