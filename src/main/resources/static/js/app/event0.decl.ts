// publisher-subscriber
namespace event0 {
    "use strict";

    export type Subscriber<T> = ((t: T) => void);

    export interface Event<T> {

        publish(value: T): void;
        subscribe(subscriber: Subscriber<T>): void;
    }
}
