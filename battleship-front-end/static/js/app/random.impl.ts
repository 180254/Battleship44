/// <reference path="random.decl.ts" />
/// <reference path="types.decl.ts" />

namespace random {
    "use strict";

    export class RandomEx implements Random {

        public cRandom: Supplier<number>;

        public constructor() {
            if (typeof window === "object"
                && window.crypto
                && window.crypto.getRandomValues) {

                this.cRandom = () => {
                    const randomBytes: Uint32Array = new Uint32Array(1);
                    window.crypto.getRandomValues(randomBytes);
                    return randomBytes[0] / 0xFFFFFFFF;
                };
            } else {
                // tslint:disable:insecure-random // did my best to avoid it
                this.cRandom = () => Math.random();
            }
        }

        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
        // Any copyright is dedicated to the Public Domain. http://creativecommons.org/publicdomain/zero/1.0/

        public num(): number {
            // ensure that cRandom impl is compatible with Math.random interface
            // result should be in range <0, 1); mainly to exclude possible inclusive 1
            const min: number = 0;
            const max: number = 1 - (1e-10);
            return Math.max(Math.min(this.cRandom(), max), min);
        }

        public numArbitrary(min: number, max: number): number {
            return this.num() * (max - min) + min;
        }

        public int(min: number, max: number): number {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(this.num() * (max - min)) + min;
        }

        public intInclusive(min: number, max: number): number {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(this.num() * (max - min + 1)) + min;
        }

        // -----------------------------------------------------------------------------------------------------------

        // credits: friends @ stackoverflow
        // url: http://stackoverflow.com/a/10727155
        // license: cc by-sa 3.0
        // license url: https://creativecommons.org/licenses/by-sa/3.0/
        // changes: es6 used & adapted to this random class

        public str(length: number, chars: string): string {
            let mask: string = "";
            if (chars.includes("a")) {
                mask += "abcdefghijklmnopqrstuvwxyz";
            }
            if (chars.includes("A")) {
                mask += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            }
            if (chars.includes("0")) {
                mask += "0123456789";
            }
            if (chars.includes("!")) {
                mask += "~`!@#$%^&*()_+-={}[]:;<>?,.|";
            }

            let result: string = "";
            for (let i: number = length; i > 0; i -= 1) {
                result += mask[this.int(0, mask.length)];
            }

            return result;
        }
    }
}
