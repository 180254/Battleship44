import * as $ from 'jquery';
import {Message, Timeout} from './message.decl';
import {strings} from './strings.impl';
import {Translator, TrKey} from './i18n.decl';
import {Random} from './random.decl';
import {LoggerEx} from './logger.impl';
import {Logger} from './logger.decl';
import {Supplier} from './types.decl';

export class TimeoutEx implements Timeout {
  public readonly fast: number = 1500;
  public readonly default_: number = 2500;
  public readonly slow: number = 5000;
}

// ---------------------------------------------------------------------------------------------------------------

export class MessageEx implements Message {
  private readonly _logger: Logger = new LoggerEx(MessageEx);

  private readonly _random: Random;
  private readonly _translator: Translator;

  private readonly _$MsgDiv: JQuery = $(strings.message.id);
  private readonly _$ConstDiv: Supplier<string> = () =>
    strings.message.id_const;

  public constructor(random: Random, translator: Translator) {
    this._random = random;
    this._translator = translator;
  }

  public setFixed(trKey: TrKey, clazz?: string): void {
    this._set(trKey, undefined, clazz);
    this._logger.trace('state={0},{1}', trKey, clazz);
  }

  public addFleeting(trKey: TrKey, timeout: number, clazz?: string): void {
    this._set(trKey, timeout, clazz);
    this._logger.trace('state={0},{1},{2}', trKey, timeout, clazz);
  }

  public addFixedLink(trKey: TrKey, id: string, clazz?: string): void {
    const $a: JQuery = $('<a/>', {
      ['href']: '#',
      ['id']: id.substring(1),
      ['class']: clazz || '',
    });

    this._translator.setTr($a, trKey);
    $(this._$ConstDiv()).append($a);

    this._logger.trace('state={0},{1},{2}', trKey, id, clazz);
  }

  private _set(key: TrKey, timeout?: number, clazz?: string): void {
    const outerId: string = timeout
      ? '#{0}'.format(this._random.str(7, 'a'))
      : this._$ConstDiv();

    const $outer: JQuery = $('<span/>', {
      ['id']: outerId.substring(1),
      ['class']: '{0} msg'.format(clazz || ''),
    });

    const $inner: JQuery = $('<span/>');
    this._translator.setTr($inner, key);
    $outer.append($inner);

    if (timeout) {
      this._$MsgDiv.append($outer);
      setTimeout(
        () => $(outerId).fadeOut('fast', () => $(outerId).remove()),
        timeout
      );
    } else {
      $(this._$ConstDiv()).remove();
      this._$MsgDiv.append($outer);
    }
  }
}
