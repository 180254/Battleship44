/// <reference path="event0.decl.ts" />

namespace event0 {
    "use strict";

    // tslint:disable:export-name
    export class EventEx<T> implements Event<T> {
        private readonly _subscribers: ((t: T) => void)[] = [];

        public subscribe(subscriber: ((t: T) => void)): void {
            this._subscribers.push(subscriber);
        }

        public publish(value: T): void {
            this._subscribers.forEach(subscriber => subscriber(value));
        }
    }
}
