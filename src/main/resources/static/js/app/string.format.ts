"use strict";

// credits: friends @ stackoverflow
// url: http://stackoverflow.com/a/20070599
// license: cc by-sa 3.0
// license url: https://creativecommons.org/licenses/by-sa/3.0/

interface String {
    format(...replacements: string[]): string;
}

if (!String.prototype.format) {
    String.prototype.format = (...replacements: string[]): string => {
        let args: any = replacements;
        return this.replace(/{(\d+)}/g, (match: any, index: any) => typeof args[index] !== "undefined"
            ? args[index]
            : match);
    };
}
