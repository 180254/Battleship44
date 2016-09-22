/// <reference path="event1.decl.ts" />
/// <reference path="format.decl.ts" />
/// <reference path="random.decl.ts" />

namespace event1 {
    "use strict";

    export class EventEx implements Event {

        private readonly _random: random.Random;

        public constructor(random: random.Random) {
            this._random = random;
        }

        public on($e: JQuery, action: string, callback: ($e: JQuery) => void): void {
            $e.on(action, function (): void {
                callback($(this));
            });
        }

        public onetime($e: JQuery, action: string, callback: ($e: JQuery) => void): void {
            const namespace: string = this._random.str(7, "a");
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
}
