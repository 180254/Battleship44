import {Consumer} from './functional-interfaces';
import * as $ from 'jquery';
import './string-format';
import {Random} from './random';

export class DocumentEvent {
  private readonly random: Random;

  public constructor(random: Random) {
    this.random = random;
  }

  public on(
    $element: JQuery,
    event: string,
    callback: Consumer<JQuery<Element>>
  ): void {
    $element.on(event, function (this: Element): void {
      callback($(this));
    });
  }

  public off($element: JQuery, action: string): void {
    $element.off(action);
  }

  public onetime(
    $element: JQuery,
    event: string,
    callback: Consumer<JQuery<Element>>
  ): void {
    const namespace: string = this.random.str(7, 'a');
    const event2: string = '{0}.{1}'.format(event, namespace);

    $element.on(event2, function (this: Element): void {
      $element.off(event2);
      callback($(this));
    });
  }
}
