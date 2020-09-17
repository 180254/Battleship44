import {Changer} from './types.decl';

declare global {
  // noinspection JSUnusedGlobalSymbols // bug? it is used
  interface RegExpConstructor {
    // escaping text to be treated as a literal string within regular expression
    // usage: RegExp.escape("ss");
    escape: Changer<string, string>;
  }
}
