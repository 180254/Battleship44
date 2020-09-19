import {FunctionTR} from './functional-interfaces';

declare global {
  interface RegExpConstructor {
    // escaping text to be treated as a literal string within regular expression
    // usage: RegExp.escape("ss");
    escape: FunctionTR<string, string>;
  }
}
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions?
// Any copyright is dedicated to the Public Domain. http://creativecommons.org/publicdomain/zero/1.0/
// "Escaping user input to be treated as a literal string within
// a regular expression can be accomplished by replacement"
RegExp.escape = str => str.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');

export {};
