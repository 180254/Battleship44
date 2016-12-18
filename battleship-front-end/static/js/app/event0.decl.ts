/// <reference path="types.decl.ts" />

// publisher-subscriber
declare namespace event0 {

    type Subscriber<T> = Callback<T>;

    interface Event<T> {

        publish(value: T): void;
        subscribe(subscriber: Subscriber<T>): void;
    }
}
