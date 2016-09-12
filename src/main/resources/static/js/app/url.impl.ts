/// <reference path="url.decl.ts"/>

namespace url {
    "use strict";

    export class UrlEx implements Url {

        private readonly _paramRegexp: RegExp = new RegExp("[\\?&]" + name + "=([^&#]*)");

        public url(...params: UrlParam[]): string {
            const par: string = params.map(
                (p) => "{0}={1}".format(p.name, encodeURIComponent(p.value))
            ).join("&");

            return "{0}/?{1}".format(window.location.origin, par);
        }

        // credits/source: http://snipplr.com/view/26662/get-url-parameters-with-jquery--improved/
        public param(name: string): string|any {
            const results: RegExpExecArray | null
                = this._paramRegexp
                .exec(window.location.href);

            return results ? results[1] : undefined;
        }
    }

    // ---------------------------------------------------------------------------------------------------------------

    export let i: Url = new UrlEx();
}
