namespace url {
    "use strict";

    export interface Url {

        param(name: string): string | null;

        url(...params: UrlParam[]): string;
    }

    export interface UrlParam {
        readonly name: string;
        readonly value: string;
    }
}
