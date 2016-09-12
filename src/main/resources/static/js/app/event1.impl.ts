/// <reference path="event1.decl.ts" />
/// <reference path="string.format.ts" />

namespace event1 {
    "use strict";

    class Conf {
        public namespaceLength: number = 7;
        public namespaceChars: string = "a";
    }

    export const conf: Conf = new Conf();

    // ---------------------------------------------------------------------------------------------------------------

    export class EventEx implements Event {

        private _random: random.Random;

        public constructor(random: random.Random) {
            this._random = random;
        }

        public on($e: JQuery, action: string, callback: ($c: JQuery) => void): void {
            $e.on(event, function (): void {
                callback($(this));
            });
        }

        public onetime($e: JQuery, action: string, callback: ($c: JQuery) => void): void {
            const namespace: string = this._random.str(conf.namespaceLength, conf.namespaceChars);
            const event: string = "{0}.{1}".format(action, namespace);

            $e.on(event, function (): void {
                $e.off(event);
                callback($(this));
            });
        }

        public off($e: JQuery, action: string): void {
            $e.off(action);
        }
    }

    // ---------------------------------------------------------------------------------------------------------------

    export let i: Event = new EventEx(random.i);
}
