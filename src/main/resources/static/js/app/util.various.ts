namespace util {

    // credits: friends @ stackoverflow
    // url: http://stackoverflow.com/a/10727155
    // license: cc by-sa 3.0
    // license url: https://creativecommons.org/licenses/by-sa/3.0/
    export function randomString(length: number, chars: string): string {
        let mask: string = "";
        if (chars.indexOf("a") > -1) {
            mask += "abcdefghijklmnopqrstuvwxyz";
        }
        if (chars.indexOf("A") > -1) {
            mask += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        }
        if (chars.indexOf("0") > -1) {
            mask += "0123456789";
        }
        if (chars.indexOf("!") > -1) {
            mask += "~`!@#$%^&*()_+-={}[]:\";\'<>?,./|\\";
        }

        let result: string = "";
        for (let i: number = length; i > 0; i -= 1) {
            result += mask[Math.floor(Math.random() * mask.length)];
        }

        return result;
    }

    // credits/source: http://snipplr.com/view/26662/get-url-parameters-with-jquery--improved/
    export function param(name: string): string | undefined {
        const results: RegExpExecArray | null = new RegExp("[\\?&]" + name + "=([^&#]*)").exec(window.location.href);
        return results ? results[1] : undefined;
    }

    export function url(id: string): string {
        return window.location.origin + "/?id=" + encodeURIComponent(id);
    }
}
