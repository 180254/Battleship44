export type Action = () => void;
export type Callback<T> = (value: T) => void;
export type Supplier<T> = () => T;
export type Changer<I, O> = (value: I) => O;
