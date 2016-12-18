/// <reference path="escape.decl.ts" />

if (!RegExp.escape) {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions?
    // Any copyright is dedicated to the Public Domain. http://creativecommons.org/publicdomain/zero/1.0/

    // "Escaping user input to be treated as a literal string within
    // a regular expression can be accomplished by replacement"

    RegExp.escape = (str) =>
        str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}
