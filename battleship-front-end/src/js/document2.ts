import './string-format';
import {Random} from './random';

interface EventListener2 {
  node: Node;
  type: string;
  namespace?: string;
  listener: EventListenerOrEventListenerObject;
  options?: boolean | AddEventListenerOptions;
}

/**
 * Document with cooler addEventListener/removeEventListener methods.
 *
 * Supports EventListener removal without indicating a specific listener function.
 * @see https://stackoverflow.com/a/4386514
 *
 * Supports namespaced event listeners.
 * @see https://stackoverflow.com/a/44426162
 *
 * Does NOT support garbage collection.
 * If an node (for which addEventListener was applied) "disappears" from the DOM,
 * some data still remain here. Just unregister the event beforehand.
 */
export class Document2 {
  private readonly random: Random;
  private readonly eventListeners: Set<EventListener2>;

  public constructor(random: Random) {
    this.random = random;
    this.eventListeners = new Set<EventListener2>();
  }

  public getRandomNamespace(): string {
    return this.random.str(7, 'a');
  }

  /***
   * Enhanced version of node.addEventListener().
   * - unlocks the possibility to use the document2.removeEventListeners() method,
   * - 'type' may be simple ('click'), or namespaced ('click.magic').
   */
  public addEventListener(
    node: Node,
    typeAndNamespace: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void {
    const [type, namespace] = typeAndNamespace.split('.', 2);
    this.eventListeners.add({
      node: node,
      type: type,
      namespace: namespace,
      listener: listener,
      options: options,
    });
    node.addEventListener(type, listener, options);
  }

  /***
   * Enhanced version of node.removeEventListener().
   * - it is required to use document2.addEventListener() beforehand,
   * - you don't have to remember the 'listener' and 'options' passed to addEventListener(),
   * - 'type' may be simple ('click'), or namespaced ('click.magic'), or just namespace ('.magic').
   */
  public removeEventListeners(
    node: Node | undefined,
    typeAndOrNamespace: string | undefined
  ): void {
    for (const eventListener of this.eventListeners) {
      if (node !== undefined) {
        if (eventListener.node !== node) {
          continue;
        }
      }

      if (typeAndOrNamespace !== undefined) {
        const [type, namespace] = typeAndOrNamespace.split('.', 2);
        if (type !== '' && eventListener.type !== type) {
          continue;
        }
        if (namespace !== undefined && eventListener.namespace !== namespace) {
          continue;
        }
      }

      eventListener.node.removeEventListener(
        eventListener.type,
        eventListener.listener,
        eventListener.options
      );
      this.eventListeners.delete(eventListener);
    }
  }
}
