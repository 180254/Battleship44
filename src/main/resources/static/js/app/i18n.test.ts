/// <reference path="i18n.impl.ts"/>
/// <reference types="mocha" />

namespace i18n {
    "use strict";

    logger.conf.level = logger.Level.WARN;

    // ----------------------------------------------------------------------------------------------------------------

    function assert(condition: boolean): void {
        if (!condition) {
            throw new Error("condition failed");
        }
    }

    function assertNot(condition: boolean): void {
        if (condition) {
            throw new Error("condition failed");
        }
    }

    function assertSimpleEquals(expected: any, actual: any): void {
        if (expected !== actual) {
            throw new Error("expected: {0}, actual: {1}".format(expected, actual));
        }
    }

    function assertSelectEquals(expected: [string, SelectType],
                                actual: [LangTag, SelectType]): void {
        if (!LangTagEx.FROM_STRING(expected[0]).exactlyMatches(actual[0])
            || expected[1] !== actual[1]) {
            throw new Error("expected: {0}, actual: {1}".format(expected, actual));
        }
    }

// -------------------------------------------------------------------------------------------------------------------

    describe("LangTagEx", () => {

        describe("constructor", () => {

            it("should create a full-tag", () => {
                const lang: LangTag = new LangTagEx("en", "US");
                assertSimpleEquals("en", lang.lang);
                assertSimpleEquals("US", lang.region);
            });

            it("should create a lang-only-tag", () => {
                const lang: LangTag = new LangTagEx("en");
                assertSimpleEquals("en", lang.lang);
                assertSimpleEquals(undefined, lang.region);
            });
        });

        describe("construct from string", () => {

            it("should create a full-tag, separated with -", () => {
                const lang: LangTag = LangTagEx.FROM_STRING("en-US");
                assertSimpleEquals("en", lang.lang);
                assertSimpleEquals("US", lang.region);
            });

            it("should create a full-tag, separated with _", () => {
                const lang: LangTag = LangTagEx.FROM_STRING("en_US");
                assertSimpleEquals("en", lang.lang);
                assertSimpleEquals("US", lang.region);
            });

            it("should create a lang-only-tag", () => {
                const lang: LangTag = LangTagEx.FROM_STRING("en");
                assertSimpleEquals("en", lang.lang);
                assertSimpleEquals(undefined, lang.region);
            });
        });

        describe("exactlyMatches", () => {

            it("should equals with exactly same full-tag", () => {
                assert(new LangTagEx("en", "US").exactlyMatches(new LangTagEx("en", "US")));
            });

            it("should equals with exactly same lang-only-tag", () => {
                assert(new LangTagEx("en").exactlyMatches(new LangTagEx("en")));
            });

            it("should not equals: full-tag compared to lang-only-tag ", () => {
                assertNot(new LangTagEx("en", "US").exactlyMatches(new LangTagEx("en")));
            });

            it("should not equals: lang-only-tag compared to full-tag", () => {
                assertNot(new LangTagEx("en").exactlyMatches(new LangTagEx("en", "US")));
            });

            it("should not equals: full-tag compared to full-tag - different lang", () => {
                assertNot(new LangTagEx("en", "US").exactlyMatches(new LangTagEx("pl", "US")));
            });

            it("should not equals: full-tag compared to full-tag - different regions", () => {
                assertNot(new LangTagEx("en", "US").exactlyMatches(new LangTagEx("en", "GB")));
            });

            it("should not equals: lang-only-tag compared to lang-only-tag - different lang", () => {
                assertNot(new LangTagEx("en").exactlyMatches(new LangTagEx("pl")));
            });
        });

        describe("approxMatches", () => {

            it("should equals: same lang, same region", () => {
                assert(new LangTagEx("en", "US").approxMatches(new LangTagEx("en", "US")));
            });

            it("should equals: same lang, different region", () => {
                assert(new LangTagEx("en", "US").approxMatches(new LangTagEx("en", "GB")));
            });

            it("should equals: same lang: full-tag compared to lang-only-tag ", () => {
                assert(new LangTagEx("en", "US").approxMatches(new LangTagEx("en")));
            });

            it("should not equals: different lang, different region ", () => {
                assertNot(new LangTagEx("en", "US").approxMatches(new LangTagEx("pl", "PL")));
            });

            it("should not equals: different lang, same region ", () => {
                assertNot(new LangTagEx("en", "US").approxMatches(new LangTagEx("pl", "US")));
            });
        });
    });

    // ----------------------------------------------------------------------------------------------------------------

    describe("LangSelectorEx", () => {

        class SimpleLangFinder implements LangFinder {

            private readonly _user: i18n.LangTag[];
            private readonly _server: i18n.LangTag[];

            public constructor(user: string, server: string) {
                this._user = user.length ? user.split(" ").map(u => LangTagEx.FROM_STRING(u)) : [];
                this._server = server.length ? server.split(" ").map(u => LangTagEx.FROM_STRING(u)) : [];
            }

            public user(): i18n.LangTag[] {
                return this._user;
            }

            public server(): i18n.LangTag[] {
                return this._server;
            }
        }

        const doSelect: ((user: string, server: string) => [LangTag, SelectType]) =
            (user, server) =>
                new LangSelectorEx(new SimpleLangFinder(
                    user,
                    server
                )).select();

        describe("select", () => {

            it("should select default if none match", () => {
                const result: [LangTag, SelectType] = doSelect(
                    "en-us de-de en-gb",
                    "pl-pl",
                );

                assertSelectEquals(["pl-pl", SelectType.DEFAULT], result);
            });

            it("should select default if user array is empty", () => {
                const result: [LangTag, SelectType] = doSelect(
                    "",
                    "pl-pl en-gb en pl en-us",
                );
                assertSelectEquals(["pl-pl", SelectType.DEFAULT], result);
            });

            it("should prefer user lang, even if it is not first in server(1)", () => {
                const result: [LangTag, SelectType] = doSelect(
                    "de-de de-us pl-pl",
                    "en-us en-gb en-us pl-pl",
                );

                assertSelectEquals(["pl-pl", SelectType.EXACTLY], result);
            });

            it("should prefer user lang, even if it is not first in server(2)", () => {
                const result: [LangTag, SelectType] = doSelect(
                    "pl en-us",
                    "en-us en-gb en-us pl-pl",
                );

                assertSelectEquals(["pl-pl", SelectType.APPROX], result);
            });

            it("should prefer user lang, even if it is not first in server(3)", () => {
                const result: [LangTag, SelectType] = doSelect(
                    "pl-pl",
                    "en-us pl en-gb en-us",
                );
                assertSelectEquals(["pl", SelectType.EXACTLY], result);
            });

            it("should prefer general, if same region is not available", () => {
                const result: [LangTag, SelectType] = doSelect(
                    "en-us pl-pl",
                    "en-gb en de de-de de-uf pl-pl",
                );
                assertSelectEquals(["en", SelectType.EXACTLY], result);
            });

            it("should prefer other region of first preference, instead of exact next preference", () => {
                const result: [LangTag, SelectType] = doSelect(
                    "en-us pl-pl",
                    "en-gb pl-pl",
                );

                assertSelectEquals(["en-gb", SelectType.APPROX], result);
            });

            it("should understand complex situation", () => {
                const result: [LangTag, SelectType] = doSelect(
                    "en-gb pl-pl pl en-us en pl",
                    "pl-pl en-us",
                );

                assertSelectEquals(["en-us", SelectType.EXACTLY], result);
            });
        });
    });
}
