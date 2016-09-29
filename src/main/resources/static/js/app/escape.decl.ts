/// <reference path="types.decl.ts" />

interface RegExpConstructor {

    // escaping text to be treated as a literal string within regular expression
    // usage: RegExp.escape("ss");
    escape: Changer<string, string>;
}
