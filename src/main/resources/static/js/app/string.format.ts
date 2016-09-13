// credits: friends @ stackoverflow
// url: http://stackoverflow.com/a/20070599
// license: cc by-sa 3.0
// license url: https://creativecommons.org/licenses/by-sa/3.0/

interface String {
    format(...args: any[]): string;
}

if (!String.prototype.format) {
    String.prototype.format = function (): string {
        "use strict";
        const args: IArguments = arguments;
        return this.replace(/{(\d+)}/g, (match: string, index: number) =>
            args[index] !== undefined
                ? args[index]
                : match);
    };
}
