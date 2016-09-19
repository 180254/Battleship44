declare namespace url {

    interface Url {

        param(name: string): string | null;
        url(...params: UrlParam[]): string;
    }

    interface UrlParam {

        readonly name: string;
        readonly value: string;
    }
}
