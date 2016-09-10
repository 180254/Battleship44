namespace event1 {

    export interface Event {

        on($e: JQuery, action: string, callback: (($p: JQuery) => void)): void;

        onetime($e: JQuery, action: string, callback: (($p: JQuery) => void)): void;

        off($e: JQuery, action: string): void;
    }
}
