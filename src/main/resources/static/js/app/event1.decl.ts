declare namespace event1 {

    interface Event {

        on($e: JQuery, action: string, callback: (($e: JQuery) => void)): void;

        onetime($e: JQuery, action: string, callback: (($e: JQuery) => void)): void;

        off($e: JQuery, action: string): void;
    }
}
