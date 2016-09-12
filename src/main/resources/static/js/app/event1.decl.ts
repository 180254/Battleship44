namespace event1 {
    "use strict";

    export interface Event {

        on($e: JQuery, action: string, callback: (($c: JQuery) => void)): void;

        onetime($e: JQuery, action: string, callback: (($c: JQuery) => void)): void;

        off($e: JQuery, action: string): void;
    }
}
