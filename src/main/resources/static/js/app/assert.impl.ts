/// <reference path="assert.decl.ts" />
/// <reference path="string.format.ts" />
/// <reference path="i18n.impl.ts" />

namespace assert {

    export function ok(condition: boolean): void {
        if (!condition) {
            throw new Error("condition failed");
        }
    }

    export function not(condition: boolean): void {
        if (condition) {
            throw new Error("condition failed");
        }
    }

    export function equals(expected: any, actual: any): void {
        if (expected !== actual) {
            throw new Error("expected: {0}, actual: {1}".format(expected, actual));
        }
    }

    function selectEquals(expected: [string, i18n.SelectType],
                          actual: [i18n.LangTag, i18n.SelectType]): void {

        if (!i18n.LangTagEx.FROM_STRING(expected[0]).exactlyMatches(actual[0])
            || expected[1] !== actual[1]) {
            throw new Error("expected: {0}, actual: {1}".format(expected, actual));
        }
    }
}
