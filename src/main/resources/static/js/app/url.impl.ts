/// <reference path="url.decl.ts"/>
/// <reference path="format.decl.ts"/>

namespace url {
    "use strict";

    export class UrlEx implements Url {

        public cLocationHref: (() => string) = () => window.location.href;
        public cLocationOrigin: (() => string) = () => window.location.origin;

        // credits/source: http://snipplr.com/view/26662/get-url-parameters-with-jquery--improved/
        // + improved handle name-only param
        public param(name: string): string | null {
            const eName: string = encodeURIComponent(name);

            const results: RegExpExecArray | null =
                new RegExp("[\\?&]" + eName + "(?:(?:=([^&#]*))|&)")
                    .exec(this.cLocationHref());

            if (results && results[1] !== undefined) {
                return decodeURIComponent(results[1]);

            } else if (results && results[1] === undefined) {
                return "";

            } else {
                return null;
            }
        }

        public url(...params: UrlParam[]): string {
            const par: string = params.map(
                (p) => {
                    const eName: string = encodeURIComponent(p.name);
                    const eValue: string = encodeURIComponent(p.value);

                    return p.value
                        ? "{0}={1}".format(eName, eValue)
                        : "{0}".format(eName);
                }
            ).join("&");

            return par.length === 0
                ? this.cLocationOrigin()
                : "{0}/?{1}".format(this.cLocationOrigin(), par);
        }
    }

    // ---------------------------------------------------------------------------------------------------------------

    export class UrlParamEx implements UrlParam {

        public readonly name: string;
        public readonly value: string;

        public constructor(name: string, value: string = "") {
            this.name = name;
            this.value = value;
        }

        public toString(): string {
            return "UrlParamEx[name={0} value={1}]".format(this.name, this.value);
        }
    }
}
