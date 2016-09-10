namespace event0 {
    "use strict";

    export interface Event<T> {
        subscribers: ((t: T) => void)[];
    }
}
