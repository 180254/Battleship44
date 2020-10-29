import {Supplier} from './functional-interfaces';

export class Random {
  public readonly random0to1: Supplier<number>;

  public constructor() {
    if (typeof window === 'object' && window.crypto && window.crypto.getRandomValues) {
      this.random0to1 = () => {
        // credits: friends @ stackoverflow
        // url: https://stackoverflow.com/a/42321673
        // license: cc by-sa 3.0
        // license url: https://creativecommons.org/licenses/by-sa/3.0/
        const randomBytes: Uint32Array = new Uint32Array(1);
        window.crypto.getRandomValues(randomBytes);
        return randomBytes[0] / (0xffffffff + 1);
      };
    } else {
      this.random0to1 = Math.random;
    }
  }

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
  // Any copyright is dedicated to the Public Domain. http://creativecommons.org/publicdomain/zero/1.0/
  public numArbitrary(min: number, max: number): number {
    return this.random0to1() * (max - min) + min;
  }

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
  // Any copyright is dedicated to the Public Domain. http://creativecommons.org/publicdomain/zero/1.0/
  public int(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(this.random0to1() * (max - min)) + min;
  }

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
  // Any copyright is dedicated to the Public Domain. http://creativecommons.org/publicdomain/zero/1.0/
  public intInclusive(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(this.random0to1() * (max - min + 1)) + min;
  }

  // credits: friends @ stackoverflow
  // url: http://stackoverflow.com/a/10727155
  // license: cc by-sa 3.0
  // license url: https://creativecommons.org/licenses/by-sa/3.0/
  // changes: es6 used & adapted to this random class
  public str(length: number, chars: string): string {
    let mask = '';
    if (chars.includes('a')) {
      mask += 'abcdefghijklmnopqrstuvwxyz';
    }
    if (chars.includes('A')) {
      mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
    if (chars.includes('0')) {
      mask += '0123456789';
    }
    if (chars.includes('!')) {
      mask += '~`!@#$%^&*()_+-={}[]:;<>?,.|';
    }

    let result = '';
    for (let i: number = length; i > 0; i -= 1) {
      result += mask[this.int(0, mask.length)];
    }

    return result;
  }
}
