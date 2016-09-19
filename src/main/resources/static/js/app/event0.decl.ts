// publisher-subscriber
declare namespace event0 {

    type Subscriber<T> = ((t: T) => void);

    interface Event<T> {

        publish(value: T): void;
        subscribe(subscriber: Subscriber<T>): void;
    }
}
