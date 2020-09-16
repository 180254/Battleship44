import {Event, Subscriber} from './event0.decl';

export class EventEx<T> implements Event<T> {
  private readonly _subscribers: Subscriber<T>[] = [];

  public subscribe(subscriber: Subscriber<T>): void {
    this._subscribers.push(subscriber);
  }

  public publish(value: T): void {
    this._subscribers.forEach(subscriber => subscriber(value));
  }
}
