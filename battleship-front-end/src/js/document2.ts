import './string-format';
import {Random} from './random';
import {Logger, LoggerFactory} from './logger';

interface EventListener {
  node: Node;
  type: string;
  listener: EventListenerOrEventListenerObject;
  options?: boolean | AddEventListenerOptions;
}

export class Document2 {
  private readonly logger: Logger = LoggerFactory.getLogger(Document2);

  private readonly random: Random;

  /**
   * @see https://stackoverflow.com/a/4386514
   * @private
   */
  private readonly eventListeners: Array<EventListener>;

  public constructor(random: Random) {
    this.random = random;
    this.eventListeners = new Array<EventListener>();
  }

  public addEventListener(
    node: Node,
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void {
    this.logger.trace('eventListeners.length={0}', this.eventListeners.length);

    this.eventListeners.push({node: node, type: type, listener: listener, options: options});
    node.addEventListener(type, listener, options);
  }

  public removeAllEventListeners(node: Node, type: string): void {
    this.logger.trace('eventListeners.length={0}', this.eventListeners.length);

    const callbacks = this.eventListeners.filter(eventListener => {
      return eventListener.node === node && eventListener.type === type;
    });

    callbacks.forEach(callback => {
      node.removeEventListener(type, callback.listener, callback.options);
    });
  }

  public addOnetimeEventListener<E extends Node = Node>(
    node: E,
    type: string,
    listener: EventListenerOrEventListenerObject
  ): void {
    node.addEventListener(type, listener, {once: true});
  }
}
