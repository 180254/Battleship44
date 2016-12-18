declare namespace serializer {

    interface Serializer<IN, OUT> {

        convert(value: IN): OUT;
    }
}
