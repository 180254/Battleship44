// credits: friends @ stackoverflow
// url: http://stackoverflow.com/a/20070599
// license: cc by-sa 3.0
// license url: https://creativecommons.org/licenses/by-sa/3.0/

interface String {
    format(...replacements: any[]): string;
}

if (!String.prototype.format) {
    // doesn't work with arrow function
    // http://stackoverflow.com/a/34361380
    // tslint:disable:only-arrow-functions
    String.prototype.format = function (): string {
        "use strict";
        const args: IArguments = arguments;
        return this.replace(/{(\d+)}/g, (match: string, index: number) =>
            args[index] !== undefined
                ? args[index]
                : match);
    };
}
