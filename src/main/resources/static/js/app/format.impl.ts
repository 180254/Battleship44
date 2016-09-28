/// <reference path="format.decl.ts" />

// credits: friends @ stackoverflow
// url: http://stackoverflow.com/a/20070599
// license: cc by-sa 3.0
// license url: https://creativecommons.org/licenses/by-sa/3.0/

if (!String.prototype.format) {
    // tslint: why? is valid & not replaceable
    // tslint:disable:no-invalid-this
    String.prototype.format = function (): string {
        "use strict";
        const args: IArguments = arguments;
        return this.replace(/{(\d+)}/g, (match: string, index: number) =>
            index < args.length
                ? args[index]
                : match);
    };
}
