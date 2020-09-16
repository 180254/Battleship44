export interface Serializer<IN, OUT> {
  convert(value: IN): OUT;
}
