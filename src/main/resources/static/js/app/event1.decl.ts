/// <reference path="types.decl.ts" />

declare namespace event1 {

    interface Event {

        on($e: JQuery, action: string, callback: Callback<JQuery>): void;

        onetime($e: JQuery, action: string, callback: Callback<JQuery>): void;

        off($e: JQuery, action: string): void;
    }
}
