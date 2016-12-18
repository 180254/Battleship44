declare namespace url {

    interface Url {

        param(name: string): UrlParam;
        url(...params: UrlParam[]): string;
    }

    // ---------------------------------------------------------------------------------------------------------------

    interface UrlParam {

        readonly name: string;
        readonly value: string | undefined; // "" is empty value, undefined is "such param is not present"
    }
}
