/// <reference path="format.decl.ts" />

// credits: friends @ stackoverflow
// url: http://stackoverflow.com/a/20070599
// license: cc by-sa 3.0
// license url: https://creativecommons.org/licenses/by-sa/3.0/

if (!String.prototype.format) {

    // tslint:disable:no-invalid-this // no idea, bug?
    // tslint:disable:no-reserved-keywords // tslint-bug #261
    String.prototype.format = function (this: string): string {
        "use strict";
        const args: IArguments = arguments;
        return this.replace(/{(\d+)}/g, (match: string, index: number) =>
            index < args.length
                ? args[index]
                : match);
    };
}
