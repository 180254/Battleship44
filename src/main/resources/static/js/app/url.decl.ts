namespace url {
    "use strict";

    export interface UrlParam {
        readonly name: string;
        readonly value: string;
    }

    export interface Url {

        url(...params: UrlParam[]): string;

        param(name: string): string | undefined;
    }
}
