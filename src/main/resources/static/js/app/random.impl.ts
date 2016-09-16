/// <reference path="random.decl.ts" />

namespace random {
    "use strict";

    export class RandomEx implements Random {

        public cRandom: (() => number) = () => Math.random();

        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
        // Any copyright is dedicated to the Public Domain. http://creativecommons.org/publicdomain/zero/1.0/

        public num(): number {
            return this.cRandom();
        }

        public numArbitrary(min: number, max: number): number {
            return this.cRandom() * (max - min) + min;
        }

        public int(min: number, max: number): number {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(this.cRandom() * (max - min)) + min;
        }

        public intInclusive(min: number, max: number): number {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(this.cRandom() * (max - min + 1)) + min;
        }

        // -----------------------------------------------------------------------------------------------------------

        // credits: friends @ stackoverflow
        // url: http://stackoverflow.com/a/10727155
        // license: cc by-sa 3.0
        // license url: https://creativecommons.org/licenses/by-sa/3.0/

        public str(length: number, chars: string): string {
            let mask: string = "";
            if (chars.indexOf("a") > -1) {
                mask += "abcdefghijklmnopqrstuvwxyz";
            }
            if (chars.indexOf("A") > -1) {
                mask += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            }
            if (chars.indexOf("0") > -1) {
                mask += "0123456789";
            }
            if (chars.indexOf("!") > -1) {
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
