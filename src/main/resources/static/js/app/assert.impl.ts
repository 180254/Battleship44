/// <reference path="assert.decl.ts" />
/// <reference path="format.decl.ts" />

namespace assert {
    "use strict";

    export class AssertEx implements Assert {

        public ok(condition: boolean, message?: string): void {
            if (!condition) {
                throw new Error("(ok) condition failed (message: {0})".format(message));
            }
        }

        public not(condition: boolean, message?: string): void {
            if (condition) {
                throw new Error("(not) condition failed (message: {0})".format(message));
            }
        }

        public equals(expected: any, actual: any): void {
            if (expected !== actual) {
                throw new Error("expected: {0}, actual: {1}".format(expected, actual));
            }
        }

        public notEquals(expected: any, actual: any): void {
            if (expected === actual) {
                throw new Error("expected not: {0}, actual: {1}".format(expected, actual));
            }
        }

        public numEquals(expected: number, actual: number, epsilon: number = 1e-5): void {
            if (Math.abs(expected - actual) > epsilon) {
                throw new Error("expected: {0}, actual: {1}, epsilon: {2}".format(expected, actual, epsilon));
            }
        }

        public strContains(haystack: string, needle: any): void {
            if (!haystack.includes(needle)) {
                throw new Error("expected: {0} to contain: {1}".format(haystack, needle));
            }
        }
    }
}
