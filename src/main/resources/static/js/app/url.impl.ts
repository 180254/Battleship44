/// <reference path="url.decl.ts"/>
/// <reference path="format.decl.ts"/>
/// <reference path="escape.decl.ts"/>

namespace url {
    "use strict";

    export class UrlEx implements Url {

        // hash        ""
        // host        "www.nopage.com"
        // hostname    "www.nopage.com"
        // href        "http://www.nopage.com/a/dfdf?test=1"
        // origin      "http://www.nopage.com"
        // pathname    "/a/dfdf"
        // port        ""
        // protocol    "http:"
        // search      "?test=1"
        public cLocationHref: (() => string) = () => window.location.href;
        public cLocationPath: (() => string) = () => window.location.origin + window.location.pathname;

        // credits/source: http://snipplr.com/view/26662/get-url-parameters-with-jquery--improved/
        public param(name: string): UrlParam {
            const eName: string = encodeURIComponent(name);

            const results: RegExpExecArray | null =
                new RegExp("[\\?&]" + RegExp.escape(eName) + "(?:(?:=([^&#]*))|&)")
                    .exec(this.cLocationHref());

            const value: string | undefined =
                results
                    ? decodeURIComponent(results[1] || "")
                    : undefined;

            return new UrlParamEx(name, value);
        }

        public url(...params: UrlParam[]): string {
            const par: string = params
                .filter(p => p.value !== undefined)
                .map((p) => {
                        const eName: string = encodeURIComponent(p.name);
                        const eValue: string = encodeURIComponent(p.value!);

                        return p.value
                            ? "{0}={1}".format(eName, eValue)
                            : "{0}".format(eName);
                    }
                ).join("&");

            return par.length === 0
                ? this.cLocationPath()
                : "{0}/?{1}".format(this.cLocationPath(), par);
        }
    }

    // ---------------------------------------------------------------------------------------------------------------

    export class UrlParamEx implements UrlParam {

        public readonly name: string;
        public readonly value: string | undefined;

        public constructor(name: string, value: string | undefined) {
            this.name = name;
            this.value = value;
        }

        public toString(): string {
            return "UrlParamEx[name={0} value={1}]".format(this.name, this.value);
        }
    }
}
