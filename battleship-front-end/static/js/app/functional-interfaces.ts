export type Runnable = () => void;
export type Consumer<T> = (value: T) => void;
export type Supplier<T> = () => T;
export type FunctionTR<T, R> = (value: T) => R;
