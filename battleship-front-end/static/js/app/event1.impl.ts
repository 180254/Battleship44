import {Callback} from './types.decl';
import {Random} from './random.decl';
import {Event} from './event1.decl';
import * as $ from 'jquery';
import './format.decl';

export class EventEx implements Event {
  private readonly _random: Random;

  public constructor(random: Random) {
    this._random = random;
  }

  public on(
    $e: JQuery,
    action: string,
    callback: Callback<JQuery<Element | HTMLElement>>
  ): void {
    // tslint:disable:no-reserved-keywords // tslint-bug #261
    $e.on(action, function (this: Element): void {
      callback($(this));
    });
  }

  public onetime(
    $e: JQuery,
    action: string,
    callback: Callback<JQuery<Element | HTMLElement>>
  ): void {
    const namespace: string = this._random.str(7, 'a');
    const event: string = '{0}.{1}'.format(action, namespace);

    // tslint:disable:no-reserved-keywords // tslint-bug #261
    $e.on(event, function (this: Element): void {
      $e.off(event);
      callback($(this));
    });
  }

  public off($e: JQuery, action: string): void {
    $e.off(action);
  }
}
