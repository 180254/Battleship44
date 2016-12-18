type Action = () => void;
type Callback<T> = (value: T) => void;
type Supplier<T> = () => T;
type Changer<I, O> = (value: I) => O;
