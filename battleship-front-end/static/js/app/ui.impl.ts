import {Callback} from './types.decl';
import {Ui} from './ui.decl';
import {LoggerEx} from './logger.impl';
import * as $ from 'jquery';
import {Logger} from './logger.decl';
import {LangFinder, LangTag} from './i18n.decl';
import {strings} from './strings.impl';
import {Event} from './event1.decl';

export class UiEx implements Ui {
  private readonly _logger: Logger = new LoggerEx(UiEx);

  private readonly _$flags: JQuery = $(strings.flag.id);
  private readonly _event1: Event;
  private readonly _langFinder: LangFinder;

  public constructor(event1: Event, langFinder: LangFinder) {
    this._event1 = event1;
    this._langFinder = langFinder;
  }

  public initFlags(callback: Callback<LangTag>): void {
    this._langFinder.server().forEach(langTag => {
      const $flag: JQuery = $(document.createElement('img'));
      $flag.attr('alt', langTag.lang);
      $flag.attr(
        'src',
        'flag/{0}.png'.format((langTag.region || '').toLowerCase())
      );
      $flag.attr('class', strings.flag.clazz.i);

      this._event1.on($flag, 'click', () => callback(langTag));
      this._$flags.append($flag);

      this._logger.trace('init={0}', langTag);
    });
  }
}
