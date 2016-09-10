/// <reference path="string.format.ts" />
/// <reference path="util.various.ts" />
/// <reference path="event1.decl.ts" />

namespace event1 {

    export class EventEx implements Event {

        public on($e: JQuery, action: string, callback: ($p: JQuery) => void): void {
            // tslint:disable:no-function-expression
            $e.on(event, function (): void {
                callback($(this));
            });
        }

        public onetime($e: JQuery, action: string, callback: ($p: JQuery) => void): void {
            const namespace: string = util.randomString(7, "a");
            const event: string = "{0}.{1}".format(action, namespace);

            // tslint:disable:no-function-expression
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

    export let i: Event = new EventEx();

}
