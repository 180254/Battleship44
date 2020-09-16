import {Callback} from './types.decl';

export interface Event {
  on(
    $e: JQuery,
    action: string,
    callback: Callback<JQuery<Element | HTMLElement>>
  ): void;

  onetime(
    $e: JQuery,
    action: string,
    callback: Callback<JQuery<Element | HTMLElement>>
  ): void;

  off($e: JQuery, action: string): void;
}
