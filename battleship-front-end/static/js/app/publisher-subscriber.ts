import {Consumer} from './functional-interfaces';

export class PublisherSubscriber<T> {
  private readonly subscribers: Consumer<T>[] = [];

  public subscribe(subscriber: Consumer<T>): void {
    this.subscribers.push(subscriber);
  }

  public publish(value: T): void {
    this.subscribers.forEach(subscriber => subscriber(value));
  }
}
