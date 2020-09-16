import {Callback} from './types.decl';

export type Subscriber<T> = Callback<T>;

export interface Event<T> {
  publish(value: T): void;

  subscribe(subscriber: Subscriber<T>): void;
}
