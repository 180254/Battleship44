namespace serializer {
    "use strict";

    export interface Serializer<IN, OUT> {

        convert(value: IN): OUT;
    }
}
