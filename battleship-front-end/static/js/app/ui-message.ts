import {Supplier} from './functional-interfaces';
import {htmlStrings} from './html-strings';
import {Logger, LoggerFactory} from './logger';
import {Random} from './random';
import {I18nKey, Translator} from './ui-i18n';

export class UiMessageTimeout {
  public readonly fast: number = 1500;
  public readonly default: number = 2500;
  public readonly slow: number = 5000;
}

export class UiMessage {
  private readonly logger: Logger = LoggerFactory.getLogger(UiMessage);

  private readonly $msgDiv: JQuery = $(htmlStrings.message.id);
  private readonly $ConstDivSupplier: Supplier<JQuery> = () => $(htmlStrings.message.id_const);

  private readonly random: Random;
  private readonly translator: Translator;

  public constructor(random: Random, translator: Translator) {
    this.random = random;
    this.translator = translator;
  }

  public setFixed(i18nKey: I18nKey, clazz?: string): void {
    this.set(i18nKey, undefined, clazz);
    this.logger.trace('{0},{1}', i18nKey, clazz);
  }

  public addFleeting(i18nKey: I18nKey, timeout: number, clazz?: string): void {
    this.set(i18nKey, timeout, clazz);
    this.logger.trace('{0},{1},{2}', i18nKey, timeout, clazz);
  }

  public addFixedLink(i18nKey: I18nKey, id: string, clazz?: string): void {
    const $a: JQuery = $('<a/>', {
      ['href']: '#',
      ['id']: id.substring(1),
      ['class']: clazz || '',
    });

    this.translator.translateElement($a, i18nKey);
    $(this.$ConstDivSupplier()).append($a);

    this.logger.trace('{0},{1},{2}', i18nKey, id, clazz);
  }

  private set(i18nKey: I18nKey, timeout?: number, clazz?: string): void {
    const outerId: string = timeout
      ? '#{0}'.format(this.random.str(7, 'a'))
      : htmlStrings.message.id_const;

    const $outer: JQuery = $('<span/>', {
      ['id']: outerId.substring(1),
      ['class']: '{0} msg'.format(clazz || ''),
    });

    const $inner: JQuery = $('<span/>');
    this.translator.translateElement($inner, i18nKey);
    $outer.append($inner);

    if (timeout) {
      this.$msgDiv.append($outer);
      setTimeout(() => $(outerId).fadeOut('fast', () => $(outerId).remove()), timeout);
    } else {
      $(this.$ConstDivSupplier()).remove();
      this.$msgDiv.append($outer);
    }
  }
}
