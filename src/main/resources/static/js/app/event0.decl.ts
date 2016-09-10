// publisher-subscriber
namespace event0 {
    "use strict";

    export interface Event<T> {

        publish(value: T): void;

        subscribe(subscriber: ((t: T) => void)): void;
    }
}
